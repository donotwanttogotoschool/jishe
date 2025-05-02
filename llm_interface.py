#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
大语言模型接口模块 - 《千载格物》项目
LLM Interface Module for Ancient Chinese Science Project

功能：与Kimi API交互，支持流式响应和提示词工程
"""

import requests
import json
import logging
from typing import Dict, List, Optional, Generator
import time

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

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
    
    def generate_response(self, prompt: str, stream: bool = False, **kwargs) -> str:
        """
        生成回答
        
        Args:
            prompt: 提示词
            stream: 是否流式响应
            **kwargs: 其他参数
            
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
                'temperature': kwargs.get('temperature', 0.7),
                'max_tokens': kwargs.get('max_tokens', 2000),
                'top_p': kwargs.get('top_p', 0.9)
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
        try:
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
                
        except requests.exceptions.Timeout:
            logger.error("API调用超时")
            return "抱歉，API调用超时"
        except requests.exceptions.RequestException as e:
            logger.error(f"网络请求错误: {str(e)}")
            return "抱歉，网络请求错误"
    
    def _stream_response(self, data: Dict) -> Generator[str, None, None]:
        """流式响应生成器"""
        try:
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
                
        except requests.exceptions.Timeout:
            logger.error("流式API调用超时")
            yield "抱歉，流式API调用超时"
        except requests.exceptions.RequestException as e:
            logger.error(f"流式网络请求错误: {str(e)}")
            yield "抱歉，流式网络请求错误"
    
    def generate_with_retry(self, prompt: str, max_retries: int = 3, **kwargs) -> str:
        """
        带重试机制的响应生成
        
        Args:
            prompt: 提示词
            max_retries: 最大重试次数
            **kwargs: 其他参数
            
        Returns:
            生成的回答
        """
        for attempt in range(max_retries):
            try:
                response = self.generate_response(prompt, **kwargs)
                if response and not response.startswith("抱歉"):
                    return response
                
                logger.warning(f"第{attempt + 1}次尝试失败，准备重试...")
                
            except Exception as e:
                logger.error(f"第{attempt + 1}次尝试异常: {str(e)}")
            
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)  # 指数退避
        
        return "抱歉，所有重试都失败了"

class PromptEngineer:
    """提示词工程师 - 构建高质量的提示词"""
    
    @staticmethod
    def build_rag_prompt(query: str, context: List[Dict], viz_data: Dict = None) -> str:
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
        if viz_data and viz_data.get('chart_type'):
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
    def build_entity_query_prompt(query: str, entities: List[str]) -> str:
        """
        构建实体查询提示词
        
        Args:
            query: 用户查询
            entities: 识别出的实体列表
            
        Returns:
            构建的提示词
        """
        entities_text = "\n".join([f"- {entity}" for entity in entities])
        
        prompt = f"""
用户查询：{query}

识别出的实体：
{entities_text}

请分析这些实体与查询的相关性，并提供以下信息：
1. 实体类型（人物、成就、著作、地点、朝代）
2. 实体间的关系
3. 与查询的匹配度
4. 建议的检索策略
"""
        
        return prompt
    
    @staticmethod
    def build_summarization_prompt(text: str, max_length: int = 200) -> str:
        """
        构建文本摘要提示词
        
        Args:
            text: 原文
            max_length: 最大长度
            
        Returns:
            构建的提示词
        """
        prompt = f"""
请对以下关于中国古代科技史的文本进行摘要，要求：
1. 摘要长度不超过{max_length}字
2. 保留关键信息（人物、成就、时间、地点）
3. 语言简洁明了
4. 突出科技成就的重要性

原文：
{text}

摘要：
"""
        
        return prompt
    
    @staticmethod
    def parse_llm_response(response: str) -> tuple[str, Dict]:
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
    
    @staticmethod
    def extract_entities_from_response(response: str) -> List[str]:
        """
        从LLM响应中提取实体
        
        Args:
            response: LLM响应文本
            
        Returns:
            实体列表
        """
        # 简单的实体提取规则
        entities = []
        
        # 提取人名（2-4个字符的中文姓名）
        import re
        person_pattern = r'([张李王刘陈杨赵黄周吴徐孙马朱胡郭何高林罗郑梁谢宋唐许韩冯邓曹彭曾萧田董袁潘于蒋蔡余杜叶程苏魏吕丁任沈姚卢姜崔钟谭陆汪范金石廖贾夏韦付方白邹孟熊秦邱江尹薛闫段雷侯龙史陶黎贺顾毛郝龚邵万钱严覃武戴莫孔向汤][衡珍括星冲敬昇伦仲景佗鹊思邈思勰光启诫祯霞客道元徽九韶辉世杰冶孝通一行颂肃公廉思训])'
        persons = re.findall(person_pattern, response)
        entities.extend([''.join(p) for p in persons])
        
        # 提取著作名（《书名》格式）
        work_pattern = r'《([^》]+)》'
        works = re.findall(work_pattern, response)
        entities.extend(works)
        
        # 提取成就名（包含特定关键词）
        achievement_keywords = ['地动仪', '浑天仪', '活字印刷', '指南针', '火药', '造纸术']
        for keyword in achievement_keywords:
            if keyword in response:
                entities.append(keyword)
        
        return list(set(entities))

class ConversationManager:
    """对话管理器 - 管理多轮对话"""
    
    def __init__(self, llm_interface: LLMInterface):
        """
        初始化对话管理器
        
        Args:
            llm_interface: LLM接口实例
        """
        self.llm_interface = llm_interface
        self.conversation_history = []
        self.max_history = 10
    
    def add_message(self, role: str, content: str):
        """
        添加消息到对话历史
        
        Args:
            role: 角色（user/assistant）
            content: 消息内容
        """
        self.conversation_history.append({
            'role': role,
            'content': content,
            'timestamp': time.time()
        })
        
        # 保持历史记录在限制范围内
        if len(self.conversation_history) > self.max_history * 2:
            self.conversation_history = self.conversation_history[-self.max_history:]
    
    def get_conversation_context(self) -> List[Dict]:
        """
        获取对话上下文
        
        Returns:
            对话历史列表
        """
        return self.conversation_history[-self.max_history:]
    
    def generate_response_with_context(self, query: str, context: List[Dict] = None) -> str:
        """
        基于对话上下文生成回答
        
        Args:
            query: 用户查询
            context: 额外的上下文信息
            
        Returns:
            生成的回答
        """
        # 构建包含历史对话的提示词
        messages = self.get_conversation_context()
        
        # 添加当前查询
        messages.append({'role': 'user', 'content': query})
        
        # 如果有额外上下文，添加到系统消息中
        system_message = "你是一个中国古代科技史专家。"
        if context:
            context_text = "\n\n".join([doc['text'] for doc in context])
            system_message += f"\n\n参考信息：\n{context_text}"
        
        messages.insert(0, {'role': 'system', 'content': system_message})
        
        # 构建完整的提示词
        prompt = ""
        for msg in messages:
            if msg['role'] == 'system':
                prompt += f"系统：{msg['content']}\n\n"
            elif msg['role'] == 'user':
                prompt += f"用户：{msg['content']}\n"
            elif msg['role'] == 'assistant':
                prompt += f"助手：{msg['content']}\n"
        
        prompt += "助手："
        
        # 生成回答
        response = self.llm_interface.generate_response(prompt)
        
        # 添加到对话历史
        self.add_message('user', query)
        self.add_message('assistant', response)
        
        return response
    
    def clear_history(self):
        """清空对话历史"""
        self.conversation_history = []

# 使用示例
if __name__ == "__main__":
    # 配置API密钥
    api_key = "your_kimi_api_key_here"
    
    # 创建LLM接口
    llm_interface = LLMInterface(api_key)
    
    # 创建提示词工程师
    prompt_engineer = PromptEngineer()
    
    # 创建对话管理器
    conversation_manager = ConversationManager(llm_interface)
    
    # 测试基本问答
    query = "请介绍张衡的主要成就"
    response = llm_interface.generate_response(query)
    print(f"问题: {query}")
    print(f"回答: {response}")
    
    # 测试RAG提示词
    context = [
        {'text': '张衡是东汉时期著名的科学家，发明了地动仪和浑天仪。'},
        {'text': '地动仪是世界上最早的地震仪器，能够检测地震的方向。'}
    ]
    
    rag_prompt = prompt_engineer.build_rag_prompt(query, context)
    print(f"\nRAG提示词:\n{rag_prompt}")
    
    # 测试对话管理
    conversation_manager.add_message('user', '你好')
    conversation_manager.add_message('assistant', '您好！我是中国古代科技史专家，很高兴为您服务。')
    
    response = conversation_manager.generate_response_with_context('张衡是谁？')
    print(f"\n对话回答: {response}")
