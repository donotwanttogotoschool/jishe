-- 《千载格物》项目数据库架构
-- Database Schema for Ancient Chinese Science Project

-- 创建数据库
CREATE DATABASE IF NOT EXISTS ancient_science_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE ancient_science_db;

-- 人物表
CREATE TABLE persons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '姓名',
    dynasty VARCHAR(50) COMMENT '朝代',
    birth_year INT COMMENT '出生年份',
    death_year INT COMMENT '逝世年份',
    field VARCHAR(100) COMMENT '主要研究领域',
    influence_score FLOAT DEFAULT 0.0 COMMENT '影响力指数',
    description TEXT COMMENT '人物描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    INDEX idx_name (name),
    INDEX idx_dynasty (dynasty),
    INDEX idx_field (field),
    INDEX idx_influence (influence_score)
) COMMENT '古代科学家人物表';

-- 成就表
CREATE TABLE achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL COMMENT '成就名称',
    inventor VARCHAR(100) COMMENT '发明者',
    dynasty VARCHAR(50) COMMENT '朝代',
    year INT COMMENT '发明年份',
    field VARCHAR(100) COMMENT '所属领域',
    description TEXT COMMENT '成就描述',
    longitude DECIMAL(10, 7) COMMENT '经度',
    latitude DECIMAL(10, 7) COMMENT '纬度',
    influence_score FLOAT DEFAULT 0.0 COMMENT '影响力指数',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    INDEX idx_name (name),
    INDEX idx_inventor (inventor),
    INDEX idx_dynasty (dynasty),
    INDEX idx_field (field),
    INDEX idx_year (year),
    INDEX idx_location (longitude, latitude),
    INDEX idx_influence (influence_score),
    
    FOREIGN KEY (inventor) REFERENCES persons(name) ON DELETE SET NULL
) COMMENT '古代科技成就表';

-- 著作表
CREATE TABLE works (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL COMMENT '著作标题',
    author VARCHAR(100) COMMENT '作者',
    dynasty VARCHAR(50) COMMENT '朝代',
    year INT COMMENT '成书年份',
    field VARCHAR(100) COMMENT '所属领域',
    description TEXT COMMENT '著作描述',
    influence_score FLOAT DEFAULT 0.0 COMMENT '影响力指数',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    INDEX idx_title (title),
    INDEX idx_author (author),
    INDEX idx_dynasty (dynasty),
    INDEX idx_field (field),
    INDEX idx_year (year),
    INDEX idx_influence (influence_score),
    
    FOREIGN KEY (author) REFERENCES persons(name) ON DELETE SET NULL
) COMMENT '古代科技著作表';

-- 关系表
CREATE TABLE relations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL COMMENT '主体ID',
    subject_type ENUM('person', 'achievement', 'work') NOT NULL COMMENT '主体类型',
    relation_type VARCHAR(100) NOT NULL COMMENT '关系类型',
    object_id INT NOT NULL COMMENT '客体ID',
    object_type ENUM('person', 'achievement', 'work') NOT NULL COMMENT '客体类型',
    confidence FLOAT DEFAULT 1.0 COMMENT '置信度',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    
    INDEX idx_subject (subject_id, subject_type),
    INDEX idx_object (object_id, object_type),
    INDEX idx_relation (relation_type),
    INDEX idx_confidence (confidence)
) COMMENT '实体关系表';

-- 地点表
CREATE TABLE locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '地点名称',
    ancient_name VARCHAR(100) COMMENT '古代名称',
    modern_name VARCHAR(100) COMMENT '现代名称',
    province VARCHAR(50) COMMENT '省份',
    longitude DECIMAL(10, 7) COMMENT '经度',
    latitude DECIMAL(10, 7) COMMENT '纬度',
    description TEXT COMMENT '地点描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    
    INDEX idx_name (name),
    INDEX idx_ancient_name (ancient_name),
    INDEX idx_modern_name (modern_name),
    INDEX idx_province (province),
    INDEX idx_location (longitude, latitude)
) COMMENT '地点表';

-- 朝代表
CREATE TABLE dynasties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL COMMENT '朝代名称',
    start_year INT COMMENT '开始年份',
    end_year INT COMMENT '结束年份',
    description TEXT COMMENT '朝代描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    
    INDEX idx_name (name),
    INDEX idx_period (start_year, end_year)
) COMMENT '朝代表';

-- 领域表
CREATE TABLE fields (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '领域名称',
    category VARCHAR(50) COMMENT '分类',
    description TEXT COMMENT '领域描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    
    INDEX idx_name (name),
    INDEX idx_category (category)
) COMMENT '学科领域表';

-- 数据源表
CREATE TABLE data_sources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL COMMENT '数据源名称',
    type ENUM('webpage', 'pdf', 'text', 'database') NOT NULL COMMENT '数据源类型',
    url VARCHAR(500) COMMENT 'URL地址',
    file_path VARCHAR(500) COMMENT '文件路径',
    description TEXT COMMENT '数据源描述',
    extraction_time TIMESTAMP COMMENT '提取时间',
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending' COMMENT '处理状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    
    INDEX idx_name (name),
    INDEX idx_type (type),
    INDEX idx_status (status)
) COMMENT '数据源表';

-- 向量索引表
CREATE TABLE vector_indexes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '索引名称',
    model_name VARCHAR(100) NOT NULL COMMENT '嵌入模型名称',
    vector_dim INT NOT NULL COMMENT '向量维度',
    document_count INT DEFAULT 0 COMMENT '文档数量',
    file_path VARCHAR(500) COMMENT '索引文件路径',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    INDEX idx_name (name),
    INDEX idx_model (model_name)
) COMMENT '向量索引元数据表';

-- 查询日志表
CREATE TABLE query_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_query TEXT NOT NULL COMMENT '用户查询',
    query_intent JSON COMMENT '查询意图',
    retrieved_docs JSON COMMENT '检索到的文档',
    llm_response TEXT COMMENT 'LLM响应',
    visualization_data JSON COMMENT '可视化数据',
    processing_time FLOAT COMMENT '处理时间（秒）',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    
    INDEX idx_created_at (created_at),
    INDEX idx_processing_time (processing_time)
) COMMENT '查询日志表';

-- 插入基础数据

-- 插入朝代数据
INSERT INTO dynasties (name, start_year, end_year, description) VALUES
('汉朝', -202, 220, '包括西汉和东汉，是中国历史上重要的朝代'),
('唐朝', 618, 907, '中国历史上最强盛的朝代之一'),
('宋朝', 960, 1279, '包括北宋和南宋，科技文化高度发达'),
('元朝', 1271, 1368, '蒙古族建立的统一王朝'),
('明朝', 1368, 1644, '汉族建立的最后一个封建王朝'),
('清朝', 1644, 1911, '中国历史上最后一个封建王朝');

-- 插入领域数据
INSERT INTO fields (name, category, description) VALUES
('天文学', '自然科学', '研究天体运动和宇宙结构'),
('数学', '自然科学', '研究数量、结构、变化和空间'),
('医学', '生命科学', '研究疾病预防、诊断和治疗'),
('农学', '应用科学', '研究农业生产和农业技术'),
('工程学', '应用科学', '研究工程设计和建造'),
('化学', '自然科学', '研究物质的性质和变化'),
('物理学', '自然科学', '研究物质和能量的基本规律'),
('地理学', '自然科学', '研究地球表面和人类活动'),
('建筑学', '应用科学', '研究建筑设计和建造'),
('冶金学', '应用科学', '研究金属的提取和加工');

-- 插入地点数据
INSERT INTO locations (name, ancient_name, modern_name, province, longitude, latitude, description) VALUES
('西安市', '长安', '西安市', '陕西省', 108.948024, 34.263161, '古都长安，汉唐时期的首都'),
('洛阳市', '洛阳', '洛阳市', '河南省', 112.434468, 34.663041, '古都洛阳，东汉时期的首都'),
('开封市', '汴梁', '开封市', '河南省', 114.307081, 34.797239, '古都汴梁，北宋时期的首都'),
('杭州市', '临安', '杭州市', '浙江省', 120.155070, 30.274084, '古都临安，南宋时期的首都'),
('南京市', '金陵', '南京市', '江苏省', 118.767413, 32.041544, '古都金陵，六朝古都'),
('北京市', '大都', '北京市', '北京市', 116.407526, 39.904030, '古都大都，元朝时期的首都');

-- 创建视图

-- 人物成就视图
CREATE VIEW person_achievements AS
SELECT 
    p.id as person_id,
    p.name as person_name,
    p.dynasty as person_dynasty,
    p.field as person_field,
    a.id as achievement_id,
    a.name as achievement_name,
    a.year as achievement_year,
    a.field as achievement_field,
    a.influence_score as achievement_influence
FROM persons p
LEFT JOIN achievements a ON a.inventor = p.name;

-- 人物著作视图
CREATE VIEW person_works AS
SELECT 
    p.id as person_id,
    p.name as person_name,
    p.dynasty as person_dynasty,
    p.field as person_field,
    w.id as work_id,
    w.title as work_title,
    w.year as work_year,
    w.field as work_field,
    w.influence_score as work_influence
FROM persons p
LEFT JOIN works w ON w.author = p.name;

-- 朝代科技成就统计视图
CREATE VIEW dynasty_achievements_stats AS
SELECT 
    d.name as dynasty_name,
    d.start_year,
    d.end_year,
    COUNT(a.id) as achievement_count,
    AVG(a.influence_score) as avg_influence,
    GROUP_CONCAT(DISTINCT a.field) as fields
FROM dynasties d
LEFT JOIN achievements a ON a.dynasty = d.name
GROUP BY d.id, d.name, d.start_year, d.end_year
ORDER BY d.start_year;

-- 领域成就统计视图
CREATE VIEW field_achievements_stats AS
SELECT 
    f.name as field_name,
    f.category,
    COUNT(a.id) as achievement_count,
    COUNT(DISTINCT a.inventor) as inventor_count,
    AVG(a.influence_score) as avg_influence,
    MIN(a.year) as earliest_year,
    MAX(a.year) as latest_year
FROM fields f
LEFT JOIN achievements a ON a.field = f.name
GROUP BY f.id, f.name, f.category
ORDER BY achievement_count DESC;

-- 创建存储过程

-- 计算人物影响力指数
DELIMITER //
CREATE PROCEDURE CalculatePersonInfluence(IN person_id INT)
BEGIN
    DECLARE achievement_count INT;
    DECLARE work_count INT;
    DECLARE avg_achievement_influence FLOAT;
    DECLARE avg_work_influence FLOAT;
    DECLARE total_influence FLOAT;
    
    -- 统计成就数量
    SELECT COUNT(*) INTO achievement_count
    FROM achievements 
    WHERE inventor = (SELECT name FROM persons WHERE id = person_id);
    
    -- 统计著作数量
    SELECT COUNT(*) INTO work_count
    FROM works 
    WHERE author = (SELECT name FROM persons WHERE id = person_id);
    
    -- 计算平均成就影响力
    SELECT AVG(influence_score) INTO avg_achievement_influence
    FROM achievements 
    WHERE inventor = (SELECT name FROM persons WHERE id = person_id);
    
    -- 计算平均著作影响力
    SELECT AVG(influence_score) INTO avg_work_influence
    FROM works 
    WHERE author = (SELECT name FROM persons WHERE id = person_id);
    
    -- 计算总影响力
    SET total_influence = (achievement_count * 0.4) + (work_count * 0.3) + 
                         (COALESCE(avg_achievement_influence, 0) * 0.2) + 
                         (COALESCE(avg_work_influence, 0) * 0.1);
    
    -- 更新人物影响力指数
    UPDATE persons 
    SET influence_score = total_influence
    WHERE id = person_id;
    
    SELECT total_influence as calculated_influence;
END //
DELIMITER ;

-- 搜索相关实体
DELIMITER //
CREATE PROCEDURE SearchRelatedEntities(IN search_term VARCHAR(200))
BEGIN
    SELECT 'person' as entity_type, name as entity_name, influence_score, dynasty
    FROM persons 
    WHERE name LIKE CONCAT('%', search_term, '%')
       OR description LIKE CONCAT('%', search_term, '%')
    
    UNION ALL
    
    SELECT 'achievement' as entity_type, name as entity_name, influence_score, dynasty
    FROM achievements 
    WHERE name LIKE CONCAT('%', search_term, '%')
       OR description LIKE CONCAT('%', search_term, '%')
    
    UNION ALL
    
    SELECT 'work' as entity_type, title as entity_name, influence_score, dynasty
    FROM works 
    WHERE title LIKE CONCAT('%', search_term, '%')
       OR description LIKE CONCAT('%', search_term, '%')
    
    ORDER BY influence_score DESC;
END //
DELIMITER ;

-- 创建触发器

-- 更新人物影响力指数触发器
DELIMITER //
CREATE TRIGGER update_person_influence_after_achievement
AFTER INSERT ON achievements
FOR EACH ROW
BEGIN
    IF NEW.inventor IS NOT NULL THEN
        CALL CalculatePersonInfluence((SELECT id FROM persons WHERE name = NEW.inventor));
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER update_person_influence_after_work
AFTER INSERT ON works
FOR EACH ROW
BEGIN
    IF NEW.author IS NOT NULL THEN
        CALL CalculatePersonInfluence((SELECT id FROM persons WHERE name = NEW.author));
    END IF;
END //
DELIMITER ;

-- 创建索引优化查询性能
CREATE FULLTEXT INDEX ft_person_description ON persons(description);
CREATE FULLTEXT INDEX ft_achievement_description ON achievements(description);
CREATE FULLTEXT INDEX ft_work_description ON works(description);

-- 创建复合索引
CREATE INDEX idx_person_dynasty_field ON persons(dynasty, field);
CREATE INDEX idx_achievement_dynasty_field ON achievements(dynasty, field);
CREATE INDEX idx_work_dynasty_field ON works(dynasty, field);

-- 创建空间索引（如果支持）
-- CREATE SPATIAL INDEX idx_achievement_location ON achievements(longitude, latitude);

-- 插入示例数据

-- 插入人物数据
INSERT INTO persons (name, dynasty, birth_year, death_year, field, description) VALUES
('张衡', '汉朝', 78, 139, '天文学', '东汉时期著名的科学家，发明了地动仪和浑天仪'),
('李时珍', '明朝', 1518, 1593, '医学', '明代著名医学家，著有《本草纲目》'),
('沈括', '宋朝', 1031, 1095, '天文学', '北宋科学家，著有《梦溪笔谈》'),
('宋应星', '明朝', 1587, 1666, '工程学', '明代科学家，著有《天工开物》'),
('祖冲之', '南北朝', 429, 500, '数学', '南北朝时期数学家，计算圆周率'),
('郭守敬', '元朝', 1231, 1316, '天文学', '元代天文学家，制作了简仪和仰仪'),
('毕昇', '宋朝', NULL, NULL, '工程学', '北宋发明家，发明了活字印刷术'),
('蔡伦', '汉朝', NULL, 121, '工程学', '东汉发明家，改进了造纸术'),
('张仲景', '汉朝', 150, 219, '医学', '东汉医学家，著有《伤寒杂病论》'),
('华佗', '汉朝', 145, 208, '医学', '东汉医学家，发明了麻沸散');

-- 插入成就数据
INSERT INTO achievements (name, inventor, dynasty, year, field, description, longitude, latitude, influence_score) VALUES
('地动仪', '张衡', '汉朝', 132, '天文学', '世界上最早的地震仪器，能够检测地震的方向', 108.948024, 34.263161, 0.9),
('浑天仪', '张衡', '汉朝', 130, '天文学', '用于观测天体的仪器', 108.948024, 34.263161, 0.8),
('活字印刷', '毕昇', '宋朝', 1040, '工程学', '世界上最早的活字印刷技术', 120.155070, 30.274084, 0.95),
('造纸术', '蔡伦', '汉朝', 105, '工程学', '改进了造纸技术，发明了蔡侯纸', 108.948024, 34.263161, 0.9),
('简仪', '郭守敬', '元朝', 1276, '天文学', '简化的天文观测仪器', 116.407526, 39.904030, 0.7),
('仰仪', '郭守敬', '元朝', 1279, '天文学', '用于测量天体高度的仪器', 116.407526, 39.904030, 0.7),
('圆周率', '祖冲之', '南北朝', 480, '数学', '计算圆周率到小数点后七位', NULL, NULL, 0.85),
('麻沸散', '华佗', '汉朝', 200, '医学', '世界上最早的麻醉药', 108.948024, 34.263161, 0.8);

-- 插入著作数据
INSERT INTO works (title, author, dynasty, year, field, description, influence_score) VALUES
('本草纲目', '李时珍', '明朝', 1593, '医学', '明代药物学巨著', 0.95),
('梦溪笔谈', '沈括', '宋朝', 1088, '天文学', '北宋科学笔记', 0.85),
('天工开物', '宋应星', '明朝', 1637, '工程学', '明代科技百科全书', 0.9),
('伤寒杂病论', '张仲景', '汉朝', 210, '医学', '中医经典著作', 0.9),
('九章算术', '佚名', '汉朝', 100, '数学', '古代数学经典', 0.8),
('齐民要术', '贾思勰', '南北朝', 544, '农学', '古代农学著作', 0.75),
('水经注', '郦道元', '南北朝', 527, '地理学', '古代地理学著作', 0.7),
('营造法式', '李诫', '宋朝', 1103, '建筑学', '古代建筑学著作', 0.7);

-- 插入关系数据
INSERT INTO relations (subject_id, subject_type, relation_type, object_id, object_type, confidence) VALUES
(1, 'person', '发明', 1, 'achievement', 1.0),
(1, 'person', '发明', 2, 'achievement', 1.0),
(3, 'person', '发明', 3, 'achievement', 1.0),
(4, 'person', '发明', 4, 'achievement', 1.0),
(6, 'person', '发明', 5, 'achievement', 1.0),
(6, 'person', '发明', 6, 'achievement', 1.0),
(5, 'person', '发现', 7, 'achievement', 1.0),
(10, 'person', '发明', 8, 'achievement', 1.0),
(2, 'person', '著有', 1, 'work', 1.0),
(3, 'person', '著有', 2, 'work', 1.0),
(4, 'person', '著有', 3, 'work', 1.0),
(9, 'person', '著有', 4, 'work', 1.0);

-- 更新影响力指数
CALL CalculatePersonInfluence(1);
CALL CalculatePersonInfluence(2);
CALL CalculatePersonInfluence(3);
CALL CalculatePersonInfluence(4);
CALL CalculatePersonInfluence(5);
CALL CalculatePersonInfluence(6);
CALL CalculatePersonInfluence(7);
CALL CalculatePersonInfluence(8);
CALL CalculatePersonInfluence(9);
CALL CalculatePersonInfluence(10);

-- 创建用户和权限
CREATE USER 'ancient_science_user'@'localhost' IDENTIFIED BY 'your_password_here';
GRANT SELECT, INSERT, UPDATE, DELETE ON ancient_science_db.* TO 'ancient_science_user'@'localhost';
FLUSH PRIVILEGES;
