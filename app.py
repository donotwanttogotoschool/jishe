from flask import Flask, render_template, jsonify, request, url_for, send_from_directory
import csv
import os
from pathlib import Path
import pandas as pd

app = Flask(__name__, static_url_path='')

# 定义数据结构
class PersonData:
    def __init__(self, name, dynasty, category, year="", achievements=None, description=""):
        self.name = name
        self.dynasty = dynasty
        self.category = category
        self.year = year
        self.achievements = achievements or []
        self.description = description

    def to_dict(self):
        return {
            "name": self.name,
            "dynasty": self.dynasty,
            "category": self.category,
            "year": self.year,
            "achievements": self.achievements,
            "description": self.description
        }

# 全局数据存储
category_data = {}
all_persons = []

def load_all_data():
    global category_data, all_persons
    categories = ["农业", "化学", "医学生物", "天文地理", "工程建筑", "数学计量", "物理"]

    for category in categories:
        base_path = Path("database") / category
        
        # 读取人物数据
        person_path = base_path / f"{category}_人物_clean.csv"
        achievement_path = base_path / f"{category}_成就_clean.csv"

        persons = load_person_data(category, person_path)
        achievements = load_achievement_data(achievement_path)

        # 合并人物和成就数据
        for person in persons:
            if person.name in achievements:
                person.achievements = achievements[person.name]

        category_data[category] = persons
        all_persons.extend(persons)

def load_person_data(category, filepath):
    persons = []
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            reader = csv.reader(file)
            next(reader)  # 跳过表头
            for row in reader:
                if len(row) >= 2:
                    person = PersonData(
                        name=row[0],
                        dynasty=row[1],
                        category=category,
                        description=row[2] if len(row) > 2 else ""
                    )
                    persons.append(person)
    except Exception as e:
        print(f"Warning: Could not read {filepath}: {e}")
    return persons

def load_achievement_data(filepath):
    achievements = {}
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            reader = csv.reader(file)
            next(reader)  # 跳过表头
            for row in reader:
                if len(row) >= 2:
                    name = row[0]
                    if name not in achievements:
                        achievements[name] = []
                    achievements[name].append(row[1])
    except Exception as e:
        print(f"Warning: Could not read {filepath}: {e}")
    return achievements

def search_in_csv_files(keyword):
    results = []
    categories = ["农业", "化学", "医学生物", "天文地理", "工程建筑", "数学计量", "物理"]
    for category in categories:
        base_path = Path("database") / category
        person_path = base_path / f"{category}_人物_clean.csv"
        if person_path.exists():
            df = pd.read_csv(person_path, encoding='utf-8')
            mask = df.apply(lambda row: row.astype(str).str.contains(keyword, case=False).any(), axis=1)
            matched = df[mask]
            if not matched.empty:
                results.append((category, matched))
    return results

# 路由
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/home')
def home():
    # 可以添加一个别名路由，也指向首页
    return render_template('index.html')

@app.route('/overview')
def overview():
    return render_template('overview.html')

@app.route('/field-analysis')
def field_analysis():
    return render_template('field-analysis.html')

@app.route('/time-analysis')
def time_analysis():
    return render_template('time-analysis.html')

@app.route('/articles')
def articles():
    return render_template('articles.html')

# 添加静态首页路由
@app.route('/index.html')
def static_index():
    return send_from_directory(os.path.dirname(app.root_path), 'index.html')

# API路由
@app.route('/api/search')
def search():
    query = request.args.get('query', '').strip()
    if not query:
        return jsonify({"type": "none", "data": []})
    
    # 搜索 CSV 文件
    csv_results = search_in_csv_files(query)
    formatted_results = []
    for category, df in csv_results:
        formatted_results.append({
            "category": category,
            "results": df.to_dict(orient='records')
        })
    
    return jsonify({
        "type": "csv",
        "data": formatted_results
    })

@app.route('/api/statistics')
def get_statistics():
    # 统计各类别人数
    categories = [
        {"name": category, "y": len(persons)}
        for category, persons in category_data.items()
    ]

    # 统计朝代分布
    dynasty_count = {}
    for person in all_persons:
        dynasty_count[person.dynasty] = dynasty_count.get(person.dynasty, 0) + 1
    
    dynasties = [
        {"name": dynasty, "count": count}
        for dynasty, count in dynasty_count.items()
    ]

    return jsonify({
        "categories": categories,
        "dynasties": dynasties,
        "timeline": {
            "years": [],
            "achievements": []
        }
    })

@app.route('/api/timeline')
def get_timeline():
    dynasty = request.args.get('dynasty')
    timeline_data = [
        person.to_dict() for person in all_persons
        if not dynasty or person.dynasty == dynasty
    ]
    return jsonify(timeline_data)

@app.route('/api/categories')
def get_categories():
    category = request.args.get('category')
    if not category:
        return jsonify({k: [p.to_dict() for p in v] for k, v in category_data.items()})
    
    if category in category_data:
        return jsonify([p.to_dict() for p in category_data[category]])
    return jsonify([])

if __name__ == '__main__':
    load_all_data()
    app.run(debug=True, port=8080) 