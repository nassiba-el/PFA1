from groq import Groq  
  
# Replace with your actual Groq API key  
GROQ_API_KEY = "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"  
  
def test_groq_api_key(api_key):  
    try:  
        client = Groq(api_key=api_key)  
          
        # Attempt a simple chat completion  
        chat_completion = client.chat.completions.create(  
            messages=[  
                {  
                    "role": "user",  
                    "content": "Hello, what is your purpose?",  
                }  
            ],  
            model="llama3-8b-8192", # A smaller model for quick testing  
            temperature=0.1,  
            max_tokens=50  
        )  
          
        print("Successfully connected to Groq API!")  
        print("Response:", chat_completion.choices[0].message.content)  
        return True  
    except Exception as e:  
        print(f"Failed to connect to Groq API. Error: {e}")  
        return False  
  
if __name__ == "__main__":  
    print(f"Testing Groq API key: {GROQ_API_KEY[:10]}...") # Displaying first 10 chars for security  
    if test_groq_api_key(GROQ_API_KEY):  
        print("Groq API key is valid and working.")  
    else:  
        print("Groq API key is invalid or there was a connection issue.")