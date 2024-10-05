from .log_templates.soldevelo_template import SolDeveloTemplate

def select_template(content):
    return SolDeveloTemplate(content)

def process_file(file):
    content = file.read().decode('utf-8')
    template = select_template(content)
    parsed_data = template.parse()

    return parsed_data