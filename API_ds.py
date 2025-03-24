import requests
import json


def get_access_token(api_key, secret_key):
    """
    使用 API Key 和 Secret Key 自动获取 Access Token
    """
    url = "https://aip.baidubce.com/oauth/2.0/token"
    params = {
        "grant_type": "client_credentials",
        "client_id": api_key,
        "client_secret": secret_key
    }
    response = requests.post(url, params=params)
    if response.status_code == 200:
        return response.json().get("access_token")
    else:
        raise Exception(f"获取 Access Token 失败: {response.text}")


def chat_with_deepseek(api_key, secret_key, prompt):
    """
    直接通过 API Key 和 Secret Key 调用 DeepSeek-R1
    """
    # 1. 自动获取 Access Token
    access_token = get_access_token(api_key, secret_key)

    # 2. 调用 DeepSeek-R1
    url = "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro"
    headers = {"Content-Type": "application/json"}
    data = {
        "messages": [{"role": "user", "content": prompt}],
        "model": "deepseek-r1",
        "temperature": 0.7
    }
    response = requests.post(
        url,
        headers=headers,
        params={"access_token": access_token},
        data=json.dumps(data)
    )

    if response.status_code == 200:
        return response.json().get("result")
    else:
        return f"请求失败: {response.text}"


def main():
    # 替换为你的百度千帆 API Key 和 Secret Key
    API_KEY = "bce-v3/ALTAK-ZNK7zl5xwIcdbWjzSQGty/7fc82738dcb54d737bb24b54e615ee73bb5e1b6c"
    SECRET_KEY = "180bd37e3f6a4d979b02398126aa7738"

    print("DeepSeek-R1 对话程序 (输入 'exit' 退出)")
    while True:
        user_input = input("你: ")
        if user_input.lower() in ["exit", "quit"]:
            break
        response = chat_with_deepseek(API_KEY, SECRET_KEY, user_input)
        print("\nDeepSeek-R1:", response, "\n")


if __name__ == "__main__":
    main()