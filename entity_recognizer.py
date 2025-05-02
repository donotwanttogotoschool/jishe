#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
实体识别与标准化模块 - 《千载格物》项目
Entity Recognition and Standardization Module for Ancient Chinese Science Project

功能：从非结构化文本中识别核心实体，并进行标准化处理
"""

import jieba
import jieba.posseg as pseg
import re
import json
from typing import Dict, List, Set, Optional
import logging

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class EntityRecognizer:
    """实体识别器 - 识别和标准化文本中的实体"""
    
    def __init__(self):
        """初始化实体识别器"""
        # 初始化jieba分词器
        jieba.initialize()
        
        # 加载标准化词典
        self.standardization_dict = self._load_standardization_dict()
        
        # 添加自定义词典
        self._add_custom_dict()
        
        # 加载实体关键词
        self.entity_keywords = self._load_entity_keywords()
    
    def _load_standardization_dict(self) -> Dict[str, Dict[str, str]]:
        """加载标准化词典"""
        return {
            'locations': {
                # 古代地名标准化
                '长安': '西安市',
                '京兆': '西安市', 
                '洛阳': '洛阳市',
                '开封': '开封市',
                '汴梁': '开封市',
                '临安': '杭州市',
                '金陵': '南京市',
                '建康': '南京市',
                '大都': '北京市',
                '燕京': '北京市',
                '长安城': '西安市',
                '洛阳城': '洛阳市',
                '开封府': '开封市',
                '临安府': '杭州市',
                '应天府': '南京市',
                '顺天府': '北京市'
            },
            'dynasties': {
                # 朝代名称标准化
                '西汉': '汉朝',
                '东汉': '汉朝',
                '前汉': '汉朝',
                '后汉': '汉朝',
                '北宋': '宋朝',
                '南宋': '宋朝',
                '元': '元朝',
                '明': '明朝',
                '清': '清朝',
                '唐': '唐朝',
                '隋': '隋朝',
                '晋': '晋朝',
                '魏': '魏朝',
                '蜀': '蜀汉',
                '吴': '吴国'
            },
            'titles': {
                # 著作标题标准化
                '《本草纲目》': '本草纲目',
                '《九章算术》': '九章算术',
                '《天工开物》': '天工开物',
                '《梦溪笔谈》': '梦溪笔谈',
                '《齐民要术》': '齐民要术',
                '《农政全书》': '农政全书',
                '《水经注》': '水经注',
                '《徐霞客游记》': '徐霞客游记',
                '《营造法式》': '营造法式',
                '《武经总要》': '武经总要',
                '《洗冤集录》': '洗冤集录',
                '《伤寒杂病论》': '伤寒杂病论',
                '《黄帝内经》': '黄帝内经',
                '《神农本草经》': '神农本草经',
                '《周髀算经》': '周髀算经',
                '《孙子算经》': '孙子算经',
                '《海岛算经》': '海岛算经',
                '《张丘建算经》': '张丘建算经',
                '《五曹算经》': '五曹算经',
                '《夏侯阳算经》': '夏侯阳算经'
            }
        }
    
    def _load_entity_keywords(self) -> Dict[str, Set[str]]:
        """加载实体关键词"""
        return {
            'achievements': {
                # 科技成就关键词
                '地动仪', '浑天仪', '水运仪象台', '简仪', '仰仪',
                '活字印刷', '雕版印刷', '指南针', '罗盘', '司南',
                '火药', '火器', '火炮', '火箭', '火铳',
                '造纸术', '造纸', '蔡侯纸', '宣纸',
                '丝绸', '织锦', '刺绣', '缫丝',
                '瓷器', '青花瓷', '白瓷', '彩瓷',
                '青铜器', '铁器', '炼铁', '炼钢',
                '水利', '都江堰', '灵渠', '大运河',
                '建筑', '宫殿', '寺庙', '桥梁', '赵州桥',
                '医学', '针灸', '中药', '脉诊', '望诊',
                '农业', '农具', '灌溉', '耕作', '育种',
                '天文', '历法', '星图', '日晷', '漏壶',
                '数学', '算盘', '算筹', '圆周率', '勾股定理'
            },
            'fields': {
                # 学科领域关键词
                '天文学', '数学', '医学', '农学', '工程学',
                '化学', '物理学', '地理学', '生物学', '建筑学',
                '冶金学', '纺织学', '陶瓷学', '水利学', '军事学',
                '航海学', '制图学', '声学', '光学', '力学'
            }
        }
    
    def _add_custom_dict(self):
        """添加自定义词典"""
        # 古代科学家
        scientists = [
            '张衡', '李时珍', '沈括', '宋应星', '祖冲之', '郭守敬',
            '毕昇', '蔡伦', '张仲景', '华佗', '扁鹊', '孙思邈',
            '贾思勰', '徐光启', '李诫', '王祯', '徐霞客', '郦道元',
            '刘徽', '秦九韶', '杨辉', '朱世杰', '李冶', '王孝通',
            '僧一行', '苏颂', '沈括', '燕肃', '韩公廉', '张思训'
        ]
        
        # 古代科技著作
        works = [
            '本草纲目', '九章算术', '天工开物', '梦溪笔谈',
            '齐民要术', '农政全书', '水经注', '徐霞客游记',
            '营造法式', '武经总要', '洗冤集录', '伤寒杂病论',
            '黄帝内经', '神农本草经', '周髀算经', '孙子算经',
            '海岛算经', '张丘建算经', '五曹算经', '夏侯阳算经'
        ]
        
        # 古代地名
        locations = [
            '长安', '洛阳', '开封', '临安', '金陵', '建康',
            '大都', '燕京', '京兆', '汴梁', '应天府', '顺天府'
        ]
        
        # 添加到jieba词典
        for word in scientists + works + locations:
            jieba.add_word(word)
    
    def recognize_entities(self, text: str) -> Dict[str, List[str]]:
        """
        从文本中识别实体
        
        Args:
            text: 输入文本
            
        Returns:
            包含各类实体的字典
        """
        logger.info("开始实体识别")
        
        entities = {
            'persons': [],
            'locations': [],
            'works': [],
            'achievements': [],
            'dynasties': [],
            'fields': []
        }
        
        # 使用jieba进行词性标注
        words = pseg.cut(text)
        
        for word, flag in words:
            word = word.strip()
            if not word or len(word) < 2:
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
            
            # 领域识别
            elif self._is_field(word):
                entities['fields'].append(word)
        
        # 使用正则表达式进行补充识别
        self._extract_entities_by_regex(text, entities)
        
        # 去重
        for key in entities:
            entities[key] = list(set(entities[key]))
        
        logger.info(f"实体识别完成: {sum(len(v) for v in entities.values())} 个实体")
        return entities
    
    def _is_achievement(self, word: str) -> bool:
        """判断是否为科技成就"""
        achievement_keywords = ['仪', '器', '术', '法', '印', '纸', '火', '针', '盘', '台', '桥', '堰']
        return any(keyword in word for keyword in achievement_keywords) or word in self.entity_keywords['achievements']
    
    def _is_dynasty(self, word: str) -> bool:
        """判断是否为朝代"""
        dynasty_keywords = ['朝', '代', '汉', '唐', '宋', '元', '明', '清', '隋', '晋', '魏', '蜀', '吴']
        return any(keyword in word for keyword in dynasty_keywords)
    
    def _is_field(self, word: str) -> bool:
        """判断是否为学科领域"""
        return word in self.entity_keywords['fields']
    
    def _extract_entities_by_regex(self, text: str, entities: Dict[str, List[str]]):
        """使用正则表达式补充识别实体"""
        
        # 识别著作（《书名》格式）
        work_pattern = r'《([^》]+)》'
        works = re.findall(work_pattern, text)
        entities['works'].extend(works)
        
        # 识别朝代（朝代+朝格式）
        dynasty_pattern = r'([汉唐宋元明清隋晋魏蜀吴])朝'
        dynasties = re.findall(dynasty_pattern, text)
        entities['dynasties'].extend(dynasties)
        
        # 识别地名（地名+城/府格式）
        location_pattern = r'([长安洛阳开封临安金陵建康大都燕京])[城府]?'
        locations = re.findall(location_pattern, text)
        entities['locations'].extend(locations)
        
        # 识别人物（姓名+字/号格式）
        person_pattern = r'([张李王刘陈杨赵黄周吴徐孙马朱胡郭何高林罗郑梁谢宋唐许韩冯邓曹彭曾萧田董袁潘于蒋蔡余杜叶程苏魏吕丁任沈姚卢姜崔钟谭陆汪范金石廖贾夏韦付方白邹孟熊秦邱江尹薛闫段雷侯龙史陶黎贺顾毛郝龚邵万钱严覃武戴莫孔向汤])([衡珍括星冲敬昇伦仲景佗鹊思邈思勰光启诫祯霞客道元徽九韶辉世杰冶孝通一行颂肃公廉思训])'
        persons = re.findall(person_pattern, text)
        entities['persons'].extend([''.join(p) for p in persons])
    
    def standardize_entities(self, entities: Dict[str, List[str]]) -> Dict[str, List[str]]:
        """
        标准化实体
        
        Args:
            entities: 原始实体字典
            
        Returns:
            标准化后的实体字典
        """
        logger.info("开始实体标准化")
        
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
        
        logger.info("实体标准化完成")
        return standardized
    
    def extract_entity_context(self, text: str, entity: str, context_window: int = 50) -> List[str]:
        """
        提取实体的上下文信息
        
        Args:
            text: 原文
            entity: 目标实体
            context_window: 上下文窗口大小
            
        Returns:
            上下文列表
        """
        contexts = []
        
        # 查找实体在文本中的所有位置
        positions = []
        start = 0
        while True:
            pos = text.find(entity, start)
            if pos == -1:
                break
            positions.append(pos)
            start = pos + 1
        
        # 提取每个位置的上下文
        for pos in positions:
            start_pos = max(0, pos - context_window)
            end_pos = min(len(text), pos + len(entity) + context_window)
            context = text[start_pos:end_pos]
            contexts.append(context)
        
        return contexts
    
    def calculate_entity_frequency(self, text: str, entities: Dict[str, List[str]]) -> Dict[str, Dict[str, int]]:
        """
        计算实体在文本中的出现频率
        
        Args:
            text: 原文
            entities: 实体字典
            
        Returns:
            实体频率字典
        """
        frequency = {}
        
        for entity_type, entity_list in entities.items():
            frequency[entity_type] = {}
            for entity in entity_list:
                count = text.count(entity)
                if count > 0:
                    frequency[entity_type][entity] = count
        
        return frequency
    
    def validate_entities(self, entities: Dict[str, List[str]], text: str) -> Dict[str, List[str]]:
        """
        验证实体是否在文本中真实存在
        
        Args:
            entities: 实体字典
            text: 原文
            
        Returns:
            验证后的实体字典
        """
        validated = {}
        
        for entity_type, entity_list in entities.items():
            validated_list = []
            for entity in entity_list:
                if entity in text:
                    validated_list.append(entity)
                else:
                    logger.warning(f"实体 '{entity}' 在文本中未找到")
            
            validated[entity_type] = validated_list
        
        return validated

# 使用示例
if __name__ == "__main__":
    # 创建实体识别器
    recognizer = EntityRecognizer()
    
    # 示例文本
    sample_text = """
    张衡是东汉时期著名的科学家，他发明了地动仪和浑天仪。
    李时珍是明朝的医学家，著有《本草纲目》。
    沈括在《梦溪笔谈》中记载了许多科学发现。
    毕昇发明了活字印刷术，对印刷技术产生了重大影响。
    蔡伦改进了造纸术，发明了蔡侯纸。
    祖冲之计算出了圆周率的精确值。
    郭守敬在天文学方面有重要贡献，制作了简仪和仰仪。
    """
    
    # 识别实体
    entities = recognizer.recognize_entities(sample_text)
    print("识别到的实体:")
    for entity_type, entity_list in entities.items():
        if entity_list:
            print(f"{entity_type}: {entity_list}")
    
    # 标准化实体
    standardized_entities = recognizer.standardize_entities(entities)
    print("\n标准化后的实体:")
    for entity_type, entity_list in standardized_entities.items():
        if entity_list:
            print(f"{entity_type}: {entity_list}")
    
    # 计算频率
    frequency = recognizer.calculate_entity_frequency(sample_text, entities)
    print("\n实体频率:")
    for entity_type, freq_dict in frequency.items():
        if freq_dict:
            print(f"{entity_type}: {freq_dict}")
