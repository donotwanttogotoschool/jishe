#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
《千载格物》项目数据处理流水线
Data Processing Pipeline for Ancient Chinese Science Project
日期: 2025
描述: 完整的ETL流程，从原始数据到结构化数据库
"""

import requests
import json
import re
import pandas as pd
import numpy as np
from bs4 import BeautifulSoup
import PyPDF2
import pdfplumber
import jieba
import jieba.posseg as pseg
from typing import List, Dict, Tuple, Optional
import pymysql
from sqlalchemy import create_engine, Column, Integer, String, Text, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import faiss
import numpy as np
from datetime import datetime
import logging

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ==================== 第一步：数据抽取 (Extraction) ====================

class DataExtractor:
    """数据抽取器 - 从不同数据源提取原始数据"""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def extract_from_webpage(self, url: str) -> Dict[str, str]:
        """
        从网页提取数据
        
        Args:
            url: 目标网页URL
            
        Returns:
            包含标题、内容、元数据的字典
        """
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            response.encoding = response.apparent_encoding
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # 提取标题
            title = soup.find('title')
            title_text = title.get_text().strip() if title else "无标题"
            
            # 提取主要内容（假设在main或article标签中）
            main_content = soup.find('main') or soup.find('article') or soup.find('body')
            content = main_content.get_text().strip() if main_content else ""
            
            # 提取元数据
            meta_data = {
                'url': url,
                'title': title_text,
                'content_length': len(content),
                'extraction_time': datetime.now().isoformat()
            }
            
            logger.info(f"成功从 {url} 提取数据，内容长度: {len(content)}")
            
            return {
                'title': title_text,
                'content': content,
                'metadata': meta_data
            }
            
        except Exception as e:
            logger.error(f"从 {url} 提取数据失败: {str(e)}")
            return {'title': '', 'content': '', 'metadata': {'error': str(e)}}
    
    def extract_from_pdf(self, pdf_path: str) -> Dict[str, str]:
        """
        从PDF文件提取文本
        
        Args:
            pdf_path: PDF文件路径
            
        Returns:
            包含文本内容和元数据的字典
        """
        try:
            text_content = ""
            
            # 尝试使用pdfplumber（更好的中文支持）
            try:
                with pdfplumber.open(pdf_path) as pdf:
                    for page in pdf.pages:
                        page_text = page.extract_text()
                        if page_text:
                            text_content += page_text + "\n"
            except:
                # 备用方案：使用PyPDF2
                with open(pdf_path, 'rb') as file:
                    pdf_reader = PyPDF2.PdfReader(file)
                    for page in pdf_reader.pages:
                        text_content += page.extract_text() + "\n"
            
            meta_data = {
                'file_path': pdf_path,
                'content_length': len(text_content),
                'extraction_time': datetime.now().isoformat()
            }
            
            logger.info(f"成功从 {pdf_path} 提取文本，长度: {len(text_content)}")
            
            return {
                'content': text_content,
                'metadata': meta_data
            }
            
        except Exception as e:
            logger.error(f"从 {pdf_path} 提取文本失败: {str(e)}")
            return {'content': '', 'metadata': {'error': str(e)}}

# ==================== 第二步：实体识别与标准化 ====================

class EntityRecognizer:
    """实体识别器 - 识别和标准化文本中的实体"""
    
    def __init__(self):
        # 加载标准化词典
        self.standardization_dict = self._load_standardization_dict()
        
        # 初始化jieba分词器
        jieba.initialize()
        
        # 添加自定义词典
        self._add_custom_dict()
    
    def _load_standardization_dict(self) -> Dict[str, Dict[str, str]]:
        """加载标准化词典"""
        return {
            'locations': {
                '长安': '西安市',
                '京兆': '西安市', 
                '洛阳': '洛阳市',
                '开封': '开封市',
                '汴梁': '开封市',
                '临安': '杭州市',
                '金陵': '南京市',
                '建康': '南京市',
                '大都': '北京市',
                '燕京': '北京市'
            },
            'dynasties': {
                '西汉': '汉朝',
                '东汉': '汉朝',
                '北宋': '宋朝',
                '南宋': '宋朝',
                '元': '元朝',
                '明': '明朝',
                '清': '清朝'
            },
            'titles': {
                '《本草纲目》': '本草纲目',
                '《九章算术》': '九章算术',
                '《天工开物》': '天工开物',
                '《梦溪笔谈》': '梦溪笔谈'
            }
        }
    
    def _add_custom_dict(self):
        """添加自定义词典"""
        custom_words = [
            '张衡', '李时珍', '沈括', '宋应星', '祖冲之', '郭守敬',
            '地动仪', '活字印刷', '指南针', '火药', '造纸术',
            '本草纲目', '九章算术', '天工开物', '梦溪笔谈'
        ]
        for word in custom_words:
            jieba.add_word(word)
    
    def recognize_entities(self, text: str) -> Dict[str, List[str]]:
        """
        从文本中识别实体
        
        Args:
            text: 输入文本
            
        Returns:
            包含各类实体的字典
        """
        entities = {
            'persons': [],
            'locations': [],
            'works': [],
            'achievements': [],
            'dynasties': []
        }
        
        # 使用jieba进行词性标注
        words = pseg.cut(text)
        
        for word, flag in words:
            word = word.strip()
            if not word:
                continue
                
            # 人物识别（nr词性）
            if flag == 'nr' and len(word) >= 2:
                entities['persons'].append(word)
            
            # 地点识别（ns词性）
            elif flag == 'ns' and len(word) >= 2:
                entities['locations'].append(word)
            
            # 著作识别（包含《》的文本）
            elif '《' in word and '》' in word:
                entities['works'].append(word)
            
            # 成就识别（通过关键词匹配）
            elif self._is_achievement(word):
                entities['achievements'].append(word)
            
            # 朝代识别
            elif self._is_dynasty(word):
                entities['dynasties'].append(word)
        
        # 去重
        for key in entities:
            entities[key] = list(set(entities[key]))
        
        return entities
    
    def _is_achievement(self, word: str) -> bool:
        """判断是否为科技成就"""
        achievement_keywords = ['仪', '器', '术', '法', '印', '纸', '火', '针', '盘']
        return any(keyword in word for keyword in achievement_keywords)
    
    def _is_dynasty(self, word: str) -> bool:
        """判断是否为朝代"""
        dynasty_keywords = ['朝', '代', '汉', '唐', '宋', '元', '明', '清']
        return any(keyword in word for keyword in dynasty_keywords)
    
    def standardize_entities(self, entities: Dict[str, List[str]]) -> Dict[str, List[str]]:
        """
        标准化实体
        
        Args:
            entities: 原始实体字典
            
        Returns:
            标准化后的实体字典
        """
        standardized = {}
        
        for entity_type, entity_list in entities.items():
            standardized_list = []
            
            for entity in entity_list:
                # 查找标准化映射
                if entity_type in self.standardization_dict:
                    standardized_entity = self.standardization_dict[entity_type].get(entity, entity)
                    standardized_list.append(standardized_entity)
                else:
                    standardized_list.append(entity)
            
            standardized[entity_type] = list(set(standardized_list))
        
        return standardized

# ==================== 第三步：关系链接与图谱构建 ====================

class RelationExtractor:
    """关系抽取器 - 识别实体间的关系"""
    
    def __init__(self):
        # 定义关系模式
        self.relation_patterns = {
            'person_work': [
                r'([^，。]*?)(?:著有|编写|创作|撰写)([^，。]*?)(?:《([^》]+)》|([^，。]+))',
                r'([^，。]*?)(?:的|所著)(?:《([^》]+)》|([^，。]+))',
            ],
            'person_achievement': [
                r'([^，。]*?)(?:发明|创造|制作|设计)([^，。]*?)(?:了|出)([^，。]+)',
                r'([^，。]*?)(?:是|为)([^，。]*?)(?:的发明者|的创造者)',
            ],
            'achievement_time': [
                r'([^，。]*?)(?:发明|创造|出现)(?:于|在)([^，。]*?)(?:年|时期|朝代)',
                r'([^，。]*?)(?:在|于)([^，。]*?)(?:年|时期|朝代)(?:发明|创造)',
            ],
            'achievement_location': [
                r'([^，。]*?)(?:在|于)([^，。]*?)(?:发明|创造|制作)',
                r'([^，。]*?)(?:起源于|发源于)([^，。]+)',
            ]
        }
    
    def extract_relations(self, text: str, entities: Dict[str, List[str]]) -> List[Dict[str, str]]:
        """
        从文本中抽取关系
        
        Args:
            text: 输入文本
            entities: 识别出的实体
            
        Returns:
            关系三元组列表
        """
        relations = []
        
        # 按句子分割文本
        sentences = re.split(r'[。！？；]', text)
        
        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue
            
            # 对每种关系模式进行匹配
            for relation_type, patterns in self.relation_patterns.items():
                for pattern in patterns:
                    matches = re.finditer(pattern, sentence)
                    
                    for match in matches:
                        relation = self._build_relation(match, relation_type, entities)
                        if relation:
                            relations.append(relation)
        
        return relations
    
    def _build_relation(self, match, relation_type: str, entities: Dict[str, List[str]]) -> Optional[Dict[str, str]]:
        """构建关系三元组"""
        groups = match.groups()
        
        if relation_type == 'person_work':
            if len(groups) >= 3:
                person = groups[0].strip()
                work = groups[2] if groups[2] else groups[3]
                if person and work:
                    return {
                        'subject': person,
                        'relation': '著有',
                        'object': work,
                        'type': 'person_work'
                    }
        
        elif relation_type == 'person_achievement':
            if len(groups) >= 3:
                person = groups[0].strip()
                achievement = groups[2].strip()
                if person and achievement:
                    return {
                        'subject': person,
                        'relation': '发明',
                        'object': achievement,
                        'type': 'person_achievement'
                    }
        
        elif relation_type == 'achievement_time':
            if len(groups) >= 2:
                achievement = groups[0].strip()
                time = groups[1].strip()
                if achievement and time:
                    return {
                        'subject': achievement,
                        'relation': '发明于',
                        'object': time,
                        'type': 'achievement_time'
                    }
        
        elif relation_type == 'achievement_location':
            if len(groups) >= 2:
                achievement = groups[0].strip()
                location = groups[1].strip()
                if achievement and location:
                    return {
                        'subject': achievement,
                        'relation': '发明于',
                        'object': location,
                        'type': 'achievement_location'
                    }
        
        return None

# ==================== 第四步：消歧、量化与地理编码 ====================

class DataEnricher:
    """数据丰富器 - 消歧、量化和地理编码"""
    
    def __init__(self):
        self.geocoding_api_key = "your_amap_api_key_here"  # 需要替换为实际的API密钥
    
    def disambiguate_entities(self, entities: List[Dict], context: str) -> List[Dict]:
        """
        实体消歧
        
        Args:
            entities: 实体列表
            context: 上下文信息
            
        Returns:
            消歧后的实体列表
        """
        disambiguated = []
        
        for entity in entities:
            # 基于上下文进行消歧
            if entity['type'] == 'person':
                entity = self._disambiguate_person(entity, context)
            elif entity['type'] == 'location':
                entity = self._disambiguate_location(entity, context)
            
            disambiguated.append(entity)
        
        return disambiguated
    
    def _disambiguate_person(self, person: Dict, context: str) -> Dict:
        """人物消歧"""
        name = person['name']
        
        # 通过朝代信息消歧
        dynasty_patterns = {
            '李白': ['唐', '唐代'],
            '李时珍': ['明', '明代'],
            '张衡': ['汉', '汉代']
        }
        
        if name in dynasty_patterns:
            for dynasty in dynasty_patterns[name]:
                if dynasty in context:
                    person['dynasty'] = dynasty
                    break
        
        return person
    
    def _disambiguate_location(self, location: Dict, context: str) -> Dict:
        """地点消歧"""
        name = location['name']
        
        # 通过上下文判断是古代地名还是现代地名
        ancient_indicators = ['古称', '原名', '古代', '古时']
        modern_indicators = ['今', '现', '现代', '现在']
        
        for indicator in ancient_indicators:
            if indicator in context:
                location['time_period'] = 'ancient'
                break
        
        for indicator in modern_indicators:
            if indicator in context:
                location['time_period'] = 'modern'
                break
        
        return location
    
    def calculate_influence_score(self, entity: Dict) -> float:
        """
        计算影响力指数
        
        Args:
            entity: 实体信息
            
        Returns:
            影响力分数 (0-1)
        """
        score = 0.0
        
        # 基于提及次数
        mention_count = entity.get('mention_count', 0)
        score += min(mention_count / 100.0, 0.5)  # 最多贡献0.5分
        
        # 基于是否为核心成就
        is_core_achievement = entity.get('is_core_achievement', False)
        if is_core_achievement:
            score += 0.5
        
        return min(score, 1.0)
    
    def geocode_location(self, location_name: str) -> Optional[Dict[str, float]]:
        """
        地理编码 - 将地点名称转换为经纬度
        
        Args:
            location_name: 地点名称
            
        Returns:
            包含经纬度的字典
        """
        try:
            # 高德地图API调用
            url = "https://restapi.amap.com/v3/geocode/geo"
            params = {
                'key': self.geocoding_api_key,
                'address': location_name,
                'output': 'json'
            }
            
            response = requests.get(url, params=params, timeout=10)
            data = response.json()
            
            if data['status'] == '1' and data['geocodes']:
                location = data['geocodes'][0]['location']
                lng, lat = map(float, location.split(','))
                
                return {
                    'longitude': lng,
                    'latitude': lat,
                    'formatted_address': data['geocodes'][0]['formatted_address']
                }
            
        except Exception as e:
            logger.error(f"地理编码失败 {location_name}: {str(e)}")
        
        return None

# ==================== 第五步：数据加载 ====================

# 数据库模型定义
Base = declarative_base()

class Person(Base):
    """人物表"""
    __tablename__ = 'persons'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, index=True)
    dynasty = Column(String(50))
    birth_year = Column(Integer)
    death_year = Column(Integer)
    field = Column(String(100))
    influence_score = Column(Float, default=0.0)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.now)

class Achievement(Base):
    """成就表"""
    __tablename__ = 'achievements'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(200), nullable=False, index=True)
    inventor = Column(String(100))
    dynasty = Column(String(50))
    year = Column(Integer)
    field = Column(String(100))
    description = Column(Text)
    longitude = Column(Float)
    latitude = Column(Float)
    influence_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.now)

class Work(Base):
    """著作表"""
    __tablename__ = 'works'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(200), nullable=False, index=True)
    author = Column(String(100))
    dynasty = Column(String(50))
    year = Column(Integer)
    field = Column(String(100))
    description = Column(Text)
    influence_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.now)

class Relation(Base):
    """关系表"""
    __tablename__ = 'relations'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    subject_id = Column(Integer, nullable=False)
    subject_type = Column(String(50), nullable=False)
    relation_type = Column(String(100), nullable=False)
    object_id = Column(Integer, nullable=False)
    object_type = Column(String(50), nullable=False)
    confidence = Column(Float, default=1.0)
    created_at = Column(DateTime, default=datetime.now)

class DataLoader:
    """数据加载器 - 将处理后的数据存入数据库"""
    
    def __init__(self, db_url: str):
        """
        初始化数据库连接
        
        Args:
            db_url: 数据库连接URL (例如: mysql+pymysql://user:pass@localhost/dbname)
        """
        self.engine = create_engine(db_url)
        self.Session = sessionmaker(bind=self.engine)
        
        # 创建表
        Base.metadata.create_all(self.engine)
    
    def load_persons(self, persons_data: List[Dict]) -> List[int]:
        """
        批量加载人物数据
        
        Args:
            persons_data: 人物数据列表
            
        Returns:
            插入的人物ID列表
        """
        session = self.Session()
        person_ids = []
        
        try:
            for person_data in persons_data:
                person = Person(
                    name=person_data['name'],
                    dynasty=person_data.get('dynasty'),
                    birth_year=person_data.get('birth_year'),
                    death_year=person_data.get('death_year'),
                    field=person_data.get('field'),
                    influence_score=person_data.get('influence_score', 0.0),
                    description=person_data.get('description')
                )
                session.add(person)
                session.flush()  # 获取ID
                person_ids.append(person.id)
            
            session.commit()
            logger.info(f"成功加载 {len(person_ids)} 个人物记录")
            
        except Exception as e:
            session.rollback()
            logger.error(f"加载人物数据失败: {str(e)}")
            raise
        finally:
            session.close()
        
        return person_ids
    
    def load_achievements(self, achievements_data: List[Dict]) -> List[int]:
        """
        批量加载成就数据
        
        Args:
            achievements_data: 成就数据列表
            
        Returns:
            插入的成就ID列表
        """
        session = self.Session()
        achievement_ids = []
        
        try:
            for achievement_data in achievements_data:
                achievement = Achievement(
                    name=achievement_data['name'],
                    inventor=achievement_data.get('inventor'),
                    dynasty=achievement_data.get('dynasty'),
                    year=achievement_data.get('year'),
                    field=achievement_data.get('field'),
                    description=achievement_data.get('description'),
                    longitude=achievement_data.get('longitude'),
                    latitude=achievement_data.get('latitude'),
                    influence_score=achievement_data.get('influence_score', 0.0)
                )
                session.add(achievement)
                session.flush()
                achievement_ids.append(achievement.id)
            
            session.commit()
            logger.info(f"成功加载 {len(achievement_ids)} 个成就记录")
            
        except Exception as e:
            session.rollback()
            logger.error(f"加载成就数据失败: {str(e)}")
            raise
        finally:
            session.close()
        
        return achievement_ids
    
    def load_works(self, works_data: List[Dict]) -> List[int]:
        """
        批量加载著作数据
        
        Args:
            works_data: 著作数据列表
            
        Returns:
            插入的著作ID列表
        """
        session = self.Session()
        work_ids = []
        
        try:
            for work_data in works_data:
                work = Work(
                    title=work_data['title'],
                    author=work_data.get('author'),
                    dynasty=work_data.get('dynasty'),
                    year=work_data.get('year'),
                    field=work_data.get('field'),
                    description=work_data.get('description'),
                    influence_score=work_data.get('influence_score', 0.0)
                )
                session.add(work)
                session.flush()
                work_ids.append(work.id)
            
            session.commit()
            logger.info(f"成功加载 {len(work_ids)} 个著作记录")
            
        except Exception as e:
            session.rollback()
            logger.error(f"加载著作数据失败: {str(e)}")
            raise
        finally:
            session.close()
        
        return work_ids
    
    def load_relations(self, relations_data: List[Dict]) -> List[int]:
        """
        批量加载关系数据
        
        Args:
            relations_data: 关系数据列表
            
        Returns:
            插入的关系ID列表
        """
        session = self.Session()
        relation_ids = []
        
        try:
            for relation_data in relations_data:
                relation = Relation(
                    subject_id=relation_data['subject_id'],
                    subject_type=relation_data['subject_type'],
                    relation_type=relation_data['relation_type'],
                    object_id=relation_data['object_id'],
                    object_type=relation_data['object_type'],
                    confidence=relation_data.get('confidence', 1.0)
                )
                session.add(relation)
                session.flush()
                relation_ids.append(relation.id)
            
            session.commit()
            logger.info(f"成功加载 {len(relation_ids)} 个关系记录")
            
        except Exception as e:
            session.rollback()
            logger.error(f"加载关系数据失败: {str(e)}")
            raise
        finally:
            session.close()
        
        return relation_ids

# ==================== 主处理流程 ====================

class DataProcessingPipeline:
    """完整的数据处理流水线"""
    
    def __init__(self, db_url: str):
        """
        初始化流水线
        
        Args:
            db_url: 数据库连接URL
        """
        self.extractor = DataExtractor()
        self.recognizer = EntityRecognizer()
        self.relation_extractor = RelationExtractor()
        self.enricher = DataEnricher()
        self.loader = DataLoader(db_url)
    
    def process_webpage(self, url: str) -> Dict:
        """
        处理单个网页
        
        Args:
            url: 网页URL
            
        Returns:
            处理结果
        """
        logger.info(f"开始处理网页: {url}")
        
        # 第一步：数据抽取
        raw_data = self.extractor.extract_from_webpage(url)
        
        # 第二步：实体识别
        entities = self.recognizer.recognize_entities(raw_data['content'])
        standardized_entities = self.recognizer.standardize_entities(entities)
        
        # 第三步：关系抽取
        relations = self.relation_extractor.extract_relations(raw_data['content'], standardized_entities)
        
        # 第四步：数据丰富
        enriched_entities = self.enricher.disambiguate_entities(
            self._convert_to_entity_list(standardized_entities), 
            raw_data['content']
        )
        
        # 计算影响力分数
        for entity in enriched_entities:
            entity['influence_score'] = self.enricher.calculate_influence_score(entity)
        
        # 地理编码
        for entity in enriched_entities:
            if entity['type'] == 'location':
                coords = self.enricher.geocode_location(entity['name'])
                if coords:
                    entity['longitude'] = coords['longitude']
                    entity['latitude'] = coords['latitude']
        
        result = {
            'raw_data': raw_data,
            'entities': enriched_entities,
            'relations': relations,
            'processing_time': datetime.now().isoformat()
        }
        
        logger.info(f"网页处理完成: {url}")
        return result
    
    def _convert_to_entity_list(self, entities_dict: Dict[str, List[str]]) -> List[Dict]:
        """将实体字典转换为实体列表"""
        entity_list = []
        
        for entity_type, names in entities_dict.items():
            for name in names:
                entity_list.append({
                    'name': name,
                    'type': entity_type
                })
        
        return entity_list
    
    def save_to_database(self, processed_data: Dict) -> Dict[str, List[int]]:
        """
        将处理后的数据保存到数据库
        
        Args:
            processed_data: 处理后的数据
            
        Returns:
            保存的记录ID
        """
        logger.info("开始保存数据到数据库")
        
        # 准备数据
        persons_data = []
        achievements_data = []
        works_data = []
        relations_data = []
        
        # 分类处理实体
        for entity in processed_data['entities']:
            if entity['type'] == 'person':
                persons_data.append(entity)
            elif entity['type'] == 'achievement':
                achievements_data.append(entity)
            elif entity['type'] == 'work':
                works_data.append(entity)
        
        # 保存实体
        person_ids = self.loader.load_persons(persons_data)
        achievement_ids = self.loader.load_achievements(achievements_data)
        work_ids = self.loader.load_works(works_data)
        
        # 处理关系（需要实体ID映射）
        # 这里简化处理，实际应用中需要建立ID映射关系
        
        result = {
            'person_ids': person_ids,
            'achievement_ids': achievement_ids,
            'work_ids': work_ids,
            'relation_ids': []  # 简化处理
        }
        
        logger.info("数据保存完成")
        return result

# ==================== 使用示例 ====================

def main():
    """主函数 - 演示完整流程"""
    
    # 配置数据库连接
    db_url = "mysql+pymysql://username:password@localhost/ancient_science_db"
    
    # 初始化流水线
    pipeline = DataProcessingPipeline(db_url)
    
    # 示例URL列表
    urls = [
        "https://example.com/zhang-heng",
        "https://example.com/li-shi-zhen",
        "https://example.com/song-ying-xing"
    ]
    
    # 处理每个URL
    for url in urls:
        try:
            # 处理数据
            processed_data = pipeline.process_webpage(url)
            
            # 保存到数据库
            saved_ids = pipeline.save_to_database(processed_data)
            
            print(f"成功处理 {url}")
            print(f"保存的记录: {saved_ids}")
            
        except Exception as e:
            logger.error(f"处理 {url} 失败: {str(e)}")

if __name__ == "__main__":
    main()
