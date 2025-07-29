class CorsDebugMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        print("=== CORS DEBUG ===")
        print(f"Origin: {request.headers.get('Origin', 'No Origin')}")
        print(f"Method: {request.method}")
        print(f"Path: {request.path}")
        
        response = self.get_response(request)
        
        # Forçar headers CORS para debug
        response["Access-Control-Allow-Origin"] = "https://9b0f6c09b9f94793a23e4afc6b6773b8.vfs.cloud9.us-east-1.amazonaws.com"
        response["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        response["Access-Control-Allow-Headers"] = "authorization, content-type, accept, origin, user-agent, x-csrftoken, x-requested-with"
        response["Access-Control-Allow-Credentials"] = "true"
        
        print(f"Response headers: {dict(response.items())}")
        return response