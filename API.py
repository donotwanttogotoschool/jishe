import requests

url = "https://api.britishmuseum.org/collections/v1/search"
params = {
  "q": "ancient astronomical instruments",
  "limit": 10
}

# 方案1：禁用SSL验证（不推荐用于生产环境）
response = requests.get(url, params=params, verify=False)

# 或者 方案2：添加重试机制和超时设置
# response = requests.get(url, params=params, timeout=30, retries=3)

data = response.json()
print(data)
