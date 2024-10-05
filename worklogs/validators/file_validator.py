def validate_log_file(file):
    errors = []

    # Check if file is provided
    if not file:
        errors.append('No file provided.')
    elif not file.name.endswith('.txt'):
        errors.append('Unsupported file format. Only .txt files are allowed.')

    return errors
