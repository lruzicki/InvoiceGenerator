from django.http import JsonResponse
from django.views import View
from worklogs.services.file_service import process_file
from worklogs.validators.file_validator import validate_log_file
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

@method_decorator(csrf_exempt, name='dispatch')
class LogFileView(View):
    def post(self, request):
        file = request.FILES.get('file')

        # Validate the file
        errors = validate_log_file(file)
        if errors:
            return JsonResponse({'errors': errors}, status=400)

        # Process the file and extract data
        result = process_file(file)

        return JsonResponse(result)
