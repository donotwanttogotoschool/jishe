#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
知识库构建模块 - 《千载格物》项目
Knowledge Base Construction Module for Ancient Chinese Science Project

功能：构建向量化知识库，支持文档检索和相似度搜索
"""

import json
import numpy as np
import faiss
from typing import Dict, List, Optional
import logging
from datetime import datetime
from sqlalchemy import create_engine, text

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class KnowledgeBaseBuilder:
    """知识库构建器 - 构建向量化知识库"""
    
    def __init__(self, db_url: str):
        """
        初始化知识库构建器
        
        Args:
            db_url: 数据库连接URL
        """
        self.db_url = db_url
        self.engine = create_engine(db_url)
        self.vector_dim = 1024  # 嵌入向量维度
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
    
    def get_embeddings(self, texts: List[str]) -> np.ndarray:
        """
        获取文本嵌入向量（模拟实现）
        
        Args:
            texts: 文本列表
            
        Returns:
            嵌入向量数组
        """
        logger.info(f"开始生成 {len(texts)} 个文本的嵌入向量")
        
        # 模拟嵌入向量生成（实际应用中需要调用真实的嵌入模型API）
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
            
            # 获取嵌入向量
            texts = [doc['text'] for doc in documents]
            embeddings = self.get_embeddings(texts)
            
            # 构建FAISS索引
            self.index = faiss.IndexFlatIP(self.vector_dim)  # 内积索引
            self.index.add(embeddings)
            
            # 保存文档和元数据
            self.documents = documents
            self.metadata = [doc['metadata'] for doc in documents]
            
            logger.info(f"向量索引构建完成，共 {len(documents)} 个文档")
            return True
            
        except Exception as e:
            logger.error(f"构建向量索引失败: {str(e)}")
            return False
    
    def search_similar_documents(self, query: str, top_k: int = 5) -> List[Dict]:
        """
        搜索相似文档
        
        Args:
            query: 查询文本
            top_k: 返回的文档数量
            
        Returns:
            相似文档列表
        """
        if not self.index:
            logger.error("向量索引未初始化")
            return []
        
        try:
            # 获取查询的嵌入向量
            query_embedding = self.get_embeddings([query])
            
            # 搜索最相似的文档
            scores, indices = self.index.search(query_embedding, top_k)
            
            # 构建结果
            results = []
            for i, (score, idx) in enumerate(zip(scores[0], indices[0])):
                if idx < len(self.documents):
                    doc = self.documents[idx]
                    results.append({
                        'rank': i + 1,
                        'score': float(score),
                        'text': doc['text'],
                        'type': doc['type'],
                        'metadata': doc['metadata']
                    })
            
            logger.info(f"检索到 {len(results)} 个相似文档")
            return results
            
        except Exception as e:
            logger.error(f"文档搜索失败: {str(e)}")
            return []
    
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

# 使用示例
if __name__ == "__main__":
    # 配置数据库连接
    db_url = "mysql+pymysql://username:password@localhost/ancient_science_db"
    
    # 创建知识库构建器
    kb_builder = KnowledgeBaseBuilder(db_url)
    
    # 构建文档
    documents = kb_builder.build_documents_from_database()
    
    # 构建向量索引
    success = kb_builder.build_vector_index(documents)
    
    if success:
        # 测试搜索
        query = "张衡发明了什么？"
        results = kb_builder.search_similar_documents(query, top_k=3)
        
        print(f"查询: {query}")
        for result in results:
            print(f"相似度: {result['score']:.3f}")
            print(f"文档: {result['text'][:100]}...")
            print("---")
        
        # 保存索引
        kb_builder.save_index("ancient_science_kb")
