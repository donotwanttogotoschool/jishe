#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
灵枢AI系统 - 《千载格物》项目
LingShu AI System for Ancient Chinese Science Project

功能：基于RAG架构的智能问答系统，支持知识检索和可视化指令生成
"""

import requests
import json
import re
import numpy as np
import faiss
from typing import Dict, List, Optional, Tuple
import pymysql
from sqlalchemy import create_engine, text
import logging
from datetime import datetime
import time

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class KnowledgeBaseBuilder:
    """知识库构建器 - 构建向量化知识库"""
    
    def __init__(self, db_url: str, embedding_model: str = "bge-large-zh-v1.5"):
        """
        初始化知识库构建器
        
        Args:
            db_url: 数据库连接URL
            embedding_model: 嵌入模型名称
        """
        self.db_url = db_url
        self.engine = create_engine(db_url)
        self.embedding_model = embedding_model
        self.vector_dim = 1024  # BGE模型维度
        self.index = None
        self.documents = []
        self.metadata = []
    
    def build_documents_from_database(self) -> List[Dict]:
        """
        从数据库构建文档
        
        Returns:
            文档列表
        """
        logger.info("开始从数据库构建文档")
        
        documents = []
        
        try:
            with self.engine.connect() as conn:
                # 构建人物文档
                person_docs = self._build_person_documents(conn)
                documents.extend(person_docs)
                
                # 构建成就文档
                achievement_docs = self._build_achievement_documents(conn)
                documents.extend(achievement_docs)
                
                # 构建著作文档
                work_docs = self._build_work_documents(conn)
                documents.extend(work_docs)
                
                # 构建关系文档
                relation_docs = self._build_relation_documents(conn)
                documents.extend(relation_docs)
            
            logger.info(f"成功构建 {len(documents)} 个文档")
            return documents
            
        except Exception as e:
            logger.error(f"构建文档失败: {str(e)}")
            return []
    
    def _build_person_documents(self, conn) -> List[Dict]:
        """构建人物相关文档"""
        query = text("""
            SELECT p.*, 
                   GROUP_CONCAT(DISTINCT a.name) as achievements,
                   GROUP_CONCAT(DISTINCT w.title) as works
            FROM persons p
            LEFT JOIN achievements a ON a.inventor = p.name
            LEFT JOIN works w ON w.author = p.name
            GROUP BY p.id
        """)
        
        result = conn.execute(query)
        documents = []
        
        for row in result:
            doc_text = f"""
            人物：{row.name}
            朝代：{row.dynasty or '未知'}
            领域：{row.field or '未知'}
            生卒年：{row.birth_year or '未知'}-{row.death_year or '未知'}
            描述：{row.description or '无描述'}
            成就：{row.achievements or '无'}
            著作：{row.works or '无'}
            影响力指数：{row.influence_score or 0}
            """
            
            documents.append({
                'id': f"person_{row.id}",
                'text': doc_text,
                'type': 'person',
                'entity_id': row.id,
                'metadata': {
                    'name': row.name,
                    'dynasty': row.dynasty,
                    'field': row.field,
                    'influence_score': row.influence_score
                }
            })
        
        return documents
    
    def _build_achievement_documents(self, conn) -> List[Dict]:
        """构建成就相关文档"""
        query = text("""
            SELECT a.*, p.name as inventor_name
            FROM achievements a
            LEFT JOIN persons p ON a.inventor = p.name
        """)
        
        result = conn.execute(query)
        documents = []
        
        for row in result:
            doc_text = f"""
            成就：{row.name}
            发明者：{row.inventor_name or row.inventor or '未知'}
            朝代：{row.dynasty or '未知'}
            年份：{row.year or '未知'}
            领域：{row.field or '未知'}
            描述：{row.description or '无描述'}
            地理位置：{row.longitude and row.latitude and f'({row.longitude}, {row.latitude})' or '未知'}
            影响力指数：{row.influence_score or 0}
            """
            
            documents.append({
                'id': f"achievement_{row.id}",
                'text': doc_text,
                'type': 'achievement',
                'entity_id': row.id,
                'metadata': {
                    'name': row.name,
                    'inventor': row.inventor_name or row.inventor,
                    'dynasty': row.dynasty,
                    'field': row.field,
                    'longitude': row.longitude,
                    'latitude': row.latitude,
                    'influence_score': row.influence_score
                }
            })
        
        return documents
    
    def _build_work_documents(self, conn) -> List[Dict]:
        """构建著作相关文档"""
        query = text("""
            SELECT w.*, p.name as author_name
            FROM works w
            LEFT JOIN persons p ON w.author = p.name
        """)
        
        result = conn.execute(query)
        documents = []
        
        for row in result:
            doc_text = f"""
            著作：{row.title}
            作者：{row.author_name or row.author or '未知'}
            朝代：{row.dynasty or '未知'}
            年份：{row.year or '未知'}
            领域：{row.field or '未知'}
            描述：{row.description or '无描述'}
            影响力指数：{row.influence_score or 0}
            """
            
            documents.append({
                'id': f"work_{row.id}",
                'text': doc_text,
                'type': 'work',
                'entity_id': row.id,
                'metadata': {
                    'title': row.title,
                    'author': row.author_name or row.author,
                    'dynasty': row.dynasty,
                    'field': row.field,
                    'influence_score': row.influence_score
                }
            })
        
        return documents
    
    def _build_relation_documents(self, conn) -> List[Dict]:
        """构建关系相关文档"""
        query = text("""
            SELECT r.*, 
                   CASE 
                       WHEN r.subject_type = 'person' THEN p1.name
                       WHEN r.subject_type = 'achievement' THEN a1.name
                       WHEN r.subject_type = 'work' THEN w1.title
                   END as subject_name,
                   CASE 
                       WHEN r.object_type = 'person' THEN p2.name
                       WHEN r.object_type = 'achievement' THEN a2.name
                       WHEN r.object_type = 'work' THEN w2.title
                   END as object_name
            FROM relations r
            LEFT JOIN persons p1 ON r.subject_type = 'person' AND r.subject_id = p1.id
            LEFT JOIN achievements a1 ON r.subject_type = 'achievement' AND r.subject_id = a1.id
            LEFT JOIN works w1 ON r.subject_type = 'work' AND r.subject_id = w1.id
            LEFT JOIN persons p2 ON r.object_type = 'person' AND r.object_id = p2.id
            LEFT JOIN achievements a2 ON r.object_type = 'achievement' AND r.object_id = a2.id
            LEFT JOIN works w2 ON r.object_type = 'work' AND r.object_id = w2.id
        """)
        
        result = conn.execute(query)
        documents = []
        
        for row in result:
            doc_text = f"""
            关系：{row.subject_name} {row.relation_type} {row.object_name}
            关系类型：{row.relation_type}
            主体类型：{row.subject_type}
            客体类型：{row.object_type}
            置信度：{row.confidence}
            """
            
            documents.append({
                'id': f"relation_{row.id}",
                'text': doc_text,
                'type': 'relation',
                'entity_id': row.id,
                'metadata': {
                    'subject_name': row.subject_name,
                    'object_name': row.object_name,
                    'relation_type': row.relation_type,
                    'confidence': row.confidence
                }
            })
        
        return documents
    
    def chunk_documents(self, documents: List[Dict], chunk_size: int = 500) -> List[Dict]:
        """
        将文档切分成小块
        
        Args:
            documents: 原始文档列表
            chunk_size: 块大小
            
        Returns:
            切分后的文档块列表
        """
        logger.info("开始文档切分")
        
        chunks = []
        
        for doc in documents:
            text = doc['text']
            
            # 按句子切分
            sentences = re.split(r'[。！？；\n]', text)
            current_chunk = ""
            
            for sentence in sentences:
                sentence = sentence.strip()
                if not sentence:
                    continue
                
                # 如果当前块加上新句子超过大小限制，保存当前块
                if len(current_chunk) + len(sentence) > chunk_size and current_chunk:
                    chunks.append({
                        'id': f"{doc['id']}_chunk_{len(chunks)}",
                        'text': current_chunk,
                        'type': doc['type'],
                        'entity_id': doc['entity_id'],
                        'metadata': doc['metadata']
                    })
                    current_chunk = sentence
                else:
                    current_chunk += sentence + "。"
            
            # 保存最后一个块
            if current_chunk:
                chunks.append({
                    'id': f"{doc['id']}_chunk_{len(chunks)}",
                    'text': current_chunk,
                    'type': doc['type'],
                    'entity_id': doc['entity_id'],
                    'metadata': doc['metadata']
                })
        
        logger.info(f"文档切分完成，共 {len(chunks)} 个块")
        return chunks
    
    def get_embeddings(self, texts: List[str]) -> np.ndarray:
        """
        获取文本嵌入向量
        
        Args:
            texts: 文本列表
            
        Returns:
            嵌入向量数组
        """
        # 这里使用模拟的嵌入向量，实际应用中需要调用真实的嵌入模型API
        # 例如：使用sentence-transformers或调用在线API
        
        logger.info(f"开始生成 {len(texts)} 个文本的嵌入向量")
        
        # 模拟嵌入向量生成（实际应用中替换为真实API调用）
        embeddings = np.random.randn(len(texts), self.vector_dim).astype('float32')
        
        # 归一化
        embeddings = embeddings / np.linalg.norm(embeddings, axis=1, keepdims=True)
        
        logger.info("嵌入向量生成完成")
        return embeddings
    
    def build_vector_index(self, documents: List[Dict]) -> bool:
        """
        构建向量索引
        
        Args:
            documents: 文档列表
            
        Returns:
            是否成功
        """
        try:
            logger.info("开始构建向量索引")
            
            # 切分文档
            chunks = self.chunk_documents(documents)
            
            # 获取嵌入向量
            texts = [chunk['text'] for chunk in chunks]
            embeddings = self.get_embeddings(texts)
            
            # 构建FAISS索引
            self.index = faiss.IndexFlatIP(self.vector_dim)  # 内积索引
            self.index.add(embeddings)
            
            # 保存文档和元数据
            self.documents = chunks
            self.metadata = [chunk['metadata'] for chunk in chunks]
            
            logger.info(f"向量索引构建完成，共 {len(chunks)} 个文档块")
            return True
            
        except Exception as e:
            logger.error(f"构建向量索引失败: {str(e)}")
            return False
    
    def save_index(self, filepath: str) -> bool:
        """
        保存索引到文件
        
        Args:
            filepath: 文件路径
            
        Returns:
            是否成功
        """
        try:
            # 保存FAISS索引
            faiss.write_index(self.index, f"{filepath}.index")
            
            # 保存文档和元数据
            with open(f"{filepath}.json", 'w', encoding='utf-8') as f:
                json.dump({
                    'documents': self.documents,
                    'metadata': self.metadata
                }, f, ensure_ascii=False, indent=2)
            
            logger.info(f"索引已保存到 {filepath}")
            return True
            
        except Exception as e:
            logger.error(f"保存索引失败: {str(e)}")
            return False
    
    def load_index(self, filepath: str) -> bool:
        """
        从文件加载索引
        
        Args:
            filepath: 文件路径
            
        Returns:
            是否成功
        """
        try:
            # 加载FAISS索引
            self.index = faiss.read_index(f"{filepath}.index")
            
            # 加载文档和元数据
            with open(f"{filepath}.json", 'r', encoding='utf-8') as f:
                data = json.load(f)
                self.documents = data['documents']
                self.metadata = data['metadata']
            
            logger.info(f"索引已从 {filepath} 加载")
            return True
            
        except Exception as e:
            logger.error(f"加载索引失败: {str(e)}")
            return False

class QueryProcessor:
    """查询处理器 - 理解用户查询并检索相关信息"""
    
    def __init__(self, knowledge_base: KnowledgeBaseBuilder):
        """
        初始化查询处理器
        
        Args:
            knowledge_base: 知识库构建器实例
        """
        self.kb = knowledge_base
    
    def understand_query(self, query: str) -> Dict:
        """
        理解用户查询
        
        Args:
            query: 用户查询
            
        Returns:
            查询意图字典
        """
        logger.info(f"开始理解查询: {query}")
        
        # 简单的规则基础查询理解
        intent = {
            'original_query': query,
            'entities': [],
            'dynasty': None,
            'field': None,
            'analysis_type': None,
            'visualization_type': None
        }
        
        # 识别朝代
        dynasty_patterns = {
            '汉': '汉朝', '唐': '唐朝', '宋': '宋朝', '元': '元朝',
            '明': '明朝', '清': '清朝', '隋': '隋朝', '晋': '晋朝'
        }
        
        for pattern, dynasty in dynasty_patterns.items():
            if pattern in query:
                intent['dynasty'] = dynasty
                break
        
        # 识别领域
        field_patterns = {
            '天文': '天文学', '数学': '数学', '医学': '医学', '农学': '农学',
            '工程': '工程学', '化学': '化学', '物理': '物理学', '地理': '地理学'
        }
        
        for pattern, field in field_patterns.items():
            if pattern in query:
                intent['field'] = field
                break
        
        # 识别分析类型
        if '分布' in query:
            intent['analysis_type'] = 'distribution'
        elif '关系' in query or '联系' in query:
            intent['analysis_type'] = 'relationship'
        elif '时间' in query or '发展' in query:
            intent['analysis_type'] = 'timeline'
        
        # 识别可视化类型
        if '地图' in query:
            intent['visualization_type'] = 'map'
        elif '图表' in query or '统计' in query:
            intent['visualization_type'] = 'chart'
        elif '网络' in query or '关系图' in query:
            intent['visualization_type'] = 'network'
        
        logger.info(f"查询理解结果: {intent}")
        return intent
    
    def retrieve_relevant_documents(self, query: str, top_k: int = 5) -> List[Dict]:
        """
        检索相关文档
        
        Args:
            query: 查询文本
            top_k: 返回的文档数量
            
        Returns:
            相关文档列表
        """
        if not self.kb.index:
            logger.error("向量索引未初始化")
            return []
        
        try:
            # 获取查询的嵌入向量
            query_embedding = self.kb.get_embeddings([query])
            
            # 搜索最相似的文档
            scores, indices = self.kb.index.search(query_embedding, top_k)
            
            # 构建结果
            results = []
            for i, (score, idx) in enumerate(zip(scores[0], indices[0])):
                if idx < len(self.kb.documents):
                    doc = self.kb.documents[idx]
                    results.append({
                        'rank': i + 1,
                        'score': float(score),
                        'text': doc['text'],
                        'type': doc['type'],
                        'metadata': doc['metadata']
                    })
            
            logger.info(f"检索到 {len(results)} 个相关文档")
            return results
            
        except Exception as e:
            logger.error(f"文档检索失败: {str(e)}")
            return []
    
    def retrieve_visualization_data(self, intent: Dict) -> Dict:
        """
        检索可视化所需的数据
        
        Args:
            intent: 查询意图
            
        Returns:
            可视化数据字典
        """
        logger.info("开始检索可视化数据")
        
        viz_data = {
            'chart_type': None,
            'data': [],
            'options': {}
        }
        
        try:
            with self.kb.engine.connect() as conn:
                if intent['visualization_type'] == 'map':
                    viz_data.update(self._get_map_data(conn, intent))
                elif intent['visualization_type'] == 'chart':
                    viz_data.update(self._get_chart_data(conn, intent))
                elif intent['visualization_type'] == 'network':
                    viz_data.update(self._get_network_data(conn, intent))
            
            logger.info("可视化数据检索完成")
            return viz_data
            
        except Exception as e:
            logger.error(f"检索可视化数据失败: {str(e)}")
            return viz_data
    
    def _get_map_data(self, conn, intent: Dict) -> Dict:
        """获取地图数据"""
        query = text("""
            SELECT name, longitude, latitude, field, dynasty, influence_score
            FROM achievements
            WHERE longitude IS NOT NULL AND latitude IS NOT NULL
        """)
        
        if intent['dynasty']:
            query = text(f"""
                SELECT name, longitude, latitude, field, dynasty, influence_score
                FROM achievements
                WHERE longitude IS NOT NULL AND latitude IS NOT NULL
                AND dynasty = '{intent['dynasty']}'
            """)
        
        result = conn.execute(query)
        
        data = []
        for row in result:
            data.append({
                'name': row.name,
                'longitude': row.longitude,
                'latitude': row.latitude,
                'field': row.field,
                'dynasty': row.dynasty,
                'influence_score': row.influence_score
            })
        
        return {
            'chart_type': 'map',
            'data': data,
            'options': {
                'title': f"{intent.get('dynasty', '古代')}科技成就地理分布"
            }
        }
    
    def _get_chart_data(self, conn, intent: Dict) -> Dict:
        """获取图表数据"""
        if intent['analysis_type'] == 'distribution':
            query = text("""
                SELECT field, COUNT(*) as count
                FROM achievements
                GROUP BY field
                ORDER BY count DESC
            """)
            
            result = conn.execute(query)
            data = [{'field': row.field, 'count': row.count} for row in result]
            
            return {
                'chart_type': 'bar',
                'data': data,
                'options': {
                    'title': '科技成就领域分布',
                    'xAxis': 'field',
                    'yAxis': 'count'
                }
            }
        
        return {'chart_type': 'chart', 'data': [], 'options': {}}
    
    def _get_network_data(self, conn, intent: Dict) -> Dict:
        """获取网络关系数据"""
        query = text("""
            SELECT r.relation_type, 
                   CASE WHEN r.subject_type = 'person' THEN p1.name
                        WHEN r.subject_type = 'achievement' THEN a1.name
                        WHEN r.subject_type = 'work' THEN w1.title
                   END as source,
                   CASE WHEN r.object_type = 'person' THEN p2.name
                        WHEN r.object_type = 'achievement' THEN a2.name
                        WHEN r.object_type = 'work' THEN w2.title
                   END as target
            FROM relations r
            LEFT JOIN persons p1 ON r.subject_type = 'person' AND r.subject_id = p1.id
            LEFT JOIN achievements a1 ON r.subject_type = 'achievement' AND r.subject_id = a1.id
            LEFT JOIN works w1 ON r.subject_type = 'work' AND r.subject_id = w1.id
            LEFT JOIN persons p2 ON r.object_type = 'person' AND r.object_id = p2.id
            LEFT JOIN achievements a2 ON r.object_type = 'achievement' AND r.object_id = a2.id
            LEFT JOIN works w2 ON r.object_type = 'work' AND r.object_id = w2.id
            LIMIT 50
        """)
        
        result = conn.execute(query)
        
        nodes = set()
        edges = []
        
        for row in result:
            if row.source and row.target:
                nodes.add(row.source)
                nodes.add(row.target)
                edges.append({
                    'source': row.source,
                    'target': row.target,
                    'relation': row.relation_type
                })
        
        return {
            'chart_type': 'network',
            'data': {
                'nodes': [{'id': node} for node in nodes],
                'edges': edges
            },
            'options': {
                'title': '科技人物关系网络'
            }
        }

class LLMInterface:
    """大语言模型接口 - 与Kimi API交互"""
    
    def __init__(self, api_key: str, base_url: str = "https://api.moonshot.cn/v1"):
        """
        初始化LLM接口
        
        Args:
            api_key: API密钥
            base_url: API基础URL
        """
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
    
    def generate_response(self, prompt: str, stream: bool = False) -> str:
        """
        生成回答
        
        Args:
            prompt: 提示词
            stream: 是否流式响应
            
        Returns:
            生成的回答
        """
        try:
            data = {
                'model': 'moonshot-v1-8k',
                'messages': [
                    {'role': 'user', 'content': prompt}
                ],
                'stream': stream,
                'temperature': 0.7,
                'max_tokens': 2000
            }
            
            if stream:
                return self._stream_response(data)
            else:
                return self._normal_response(data)
                
        except Exception as e:
            logger.error(f"LLM调用失败: {str(e)}")
            return f"抱歉，生成回答时出现错误: {str(e)}"
    
    def _normal_response(self, data: Dict) -> str:
        """普通响应"""
        response = requests.post(
            f"{self.base_url}/chat/completions",
            headers=self.headers,
            json=data,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            return result['choices'][0]['message']['content']
        else:
            logger.error(f"API调用失败: {response.status_code} - {response.text}")
            return "抱歉，API调用失败"
    
    def _stream_response(self, data: Dict):
        """流式响应生成器"""
        response = requests.post(
            f"{self.base_url}/chat/completions",
            headers=self.headers,
            json=data,
            timeout=30,
            stream=True
        )
        
        if response.status_code == 200:
            for line in response.iter_lines():
                if line:
                    line = line.decode('utf-8')
                    if line.startswith('data: '):
                        data_str = line[6:]
                        if data_str == '[DONE]':
                            break
                        try:
                            data_json = json.loads(data_str)
                            if 'choices' in data_json and data_json['choices']:
                                content = data_json['choices'][0]['delta'].get('content', '')
                                if content:
                                    yield content
                        except json.JSONDecodeError:
                            continue
        else:
            logger.error(f"流式API调用失败: {response.status_code}")
            yield "抱歉，流式API调用失败"

class PromptEngineer:
    """提示词工程师 - 构建高质量的提示词"""
    
    @staticmethod
    def build_rag_prompt(query: str, context: List[Dict], viz_data: Dict) -> str:
        """
        构建RAG提示词
        
        Args:
            query: 用户查询
            context: 检索到的上下文
            viz_data: 可视化数据
            
        Returns:
            构建的提示词
        """
        # 构建上下文文本
        context_text = "\n\n".join([doc['text'] for doc in context])
        
        # 构建可视化指令
        viz_instruction = ""
        if viz_data.get('chart_type'):
            viz_instruction = f"""
可视化指令：
- 图表类型：{viz_data['chart_type']}
- 数据：{json.dumps(viz_data['data'], ensure_ascii=False)}
- 选项：{json.dumps(viz_data['options'], ensure_ascii=False)}
"""
        
        prompt = f"""
你是一个中国古代科技史专家，专门研究古代科学成就、人物和著作。

用户问题：{query}

请根据以下上下文信息来回答问题：

{context_text}

{viz_instruction}

请按照以下格式回答：

1. 首先给出基于上下文的准确回答
2. 然后提供可视化指令（JSON格式）

回答要求：
- 严格基于提供的上下文，不要使用外部知识
- 回答要准确、详细、有逻辑性
- 如果上下文信息不足，请说明
- 可视化指令要清晰明确

可视化指令格式：
```json
{{
    "chart_type": "图表类型",
    "data": "数据",
    "options": "配置选项",
    "highlight": "需要高亮的元素"
}}
```
"""
        
        return prompt
    
    @staticmethod
    def parse_llm_response(response: str) -> Tuple[str, Dict]:
        """
        解析LLM响应
        
        Args:
            response: LLM响应文本
            
        Returns:
            (自然语言回答, 可视化指令)
        """
        # 分离自然语言回答和可视化指令
        parts = response.split('```json')
        
        if len(parts) >= 2:
            # 提取自然语言回答
            natural_answer = parts[0].strip()
            
            # 提取JSON指令
            json_part = parts[1].split('```')[0].strip()
            try:
                viz_instruction = json.loads(json_part)
            except json.JSONDecodeError:
                viz_instruction = {}
        else:
            natural_answer = response
            viz_instruction = {}
        
        return natural_answer, viz_instruction

class LingShuAI:
    """灵枢AI主系统"""
    
    def __init__(self, db_url: str, api_key: str):
        """
        初始化灵枢AI系统
        
        Args:
            db_url: 数据库连接URL
            api_key: Kimi API密钥
        """
        self.kb_builder = KnowledgeBaseBuilder(db_url)
        self.query_processor = QueryProcessor(self.kb_builder)
        self.llm_interface = LLMInterface(api_key)
        self.prompt_engineer = PromptEngineer()
    
    def ask_question(self, question: str, stream: bool = False):
        """
        回答问题
        
        Args:
            question: 用户问题
            stream: 是否流式响应
            
        Returns:
            回答结果
        """
        logger.info(f"收到问题: {question}")
        
        try:
            # 1. 理解查询
            intent = self.query_processor.understand_query(question)
            
            # 2. 检索相关文档
            context = self.query_processor.retrieve_relevant_documents(question)
            
            # 3. 检索可视化数据
            viz_data = self.query_processor.retrieve_visualization_data(intent)
            
            # 4. 构建提示词
            prompt = self.prompt_engineer.build_rag_prompt(question, context, viz_data)
            
            # 5. 调用LLM
            if stream:
                return self._stream_response(prompt)
            else:
                response = self.llm_interface.generate_response(prompt)
                natural_answer, viz_instruction = self.prompt_engineer.parse_llm_response(response)
                
                return {
                    'answer': natural_answer,
                    'visualization': viz_instruction,
                    'context': context,
                    'intent': intent
                }
                
        except Exception as e:
            logger.error(f"处理问题失败: {str(e)}")
            return {
                'answer': f"抱歉，处理您的问题时出现错误: {str(e)}",
                'visualization': {},
                'context': [],
                'intent': {}
            }
    
    def _stream_response(self, prompt: str):
        """流式响应生成器"""
        for chunk in self.llm_interface.generate_response(prompt, stream=True):
            yield chunk

# 使用示例
if __name__ == "__main__":
    # 配置参数
    db_url = "mysql+pymysql://username:password@localhost/ancient_science_db"
    api_key = "your_kimi_api_key_here"
    
    # 创建灵枢AI系统
    ai_system = LingShuAI(db_url, api_key)
    
    # 示例问题
    questions = [
        "请介绍张衡的主要成就",
        "宋代有哪些重要的科技发明？",
        "请展示古代科技成就的地理分布",
        "李时珍和《本草纲目》有什么关系？"
    ]
    
    # 测试问答
    for question in questions:
        print(f"\n问题: {question}")
        result = ai_system.ask_question(question)
        print(f"回答: {result['answer']}")
        if result['visualization']:
            print(f"可视化: {result['visualization']}")
