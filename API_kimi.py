import requests
import json


def chat_with_kimi(api_key, prompt):
    """
  使用 Kimi API 进行对话
  :param api_key: 你的 Kimi API key
  :param prompt: 用户输入的问题
  :return: Kimi 的回答
  """
    url = "https://api.moonshot.cn/v1/chat/completions"

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    data = {
        "model": "moonshot-v1-8k",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0.3
    }

    response = requests.post(url, headers=headers, data=json.dumps(data))

    if response.status_code == 200:
        return response.json()["choices"][0]["message"]["content"]
    else:
        return f"请求失败，状态码：{response.status_code}，错误信息：{response.text}"


def main():
    # 替换为你的 Kimi API key
    API_KEY = "sk-6gyOeKBn2QhjjqpwLncQbfdwSuqhfoFjitVmoGKIOrFOgxdq"

    print("Kimi 对话程序 (输入 'exit' 退出)")
    print("=" * 40)

    while True:
        user_input = input("你: ")

        if user_input.lower() == "exit":
            print("对话结束")
            break

        response = chat_with_kimi(API_KEY, user_input)
        print("\nKimi:", response)
        print("-" * 40)


if __name__ == "__main__":
    main()