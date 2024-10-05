from .base_template import LogTemplate

class SolDeveloTemplate(LogTemplate):
    def get_current_month(self):
        # Extract current month logic
        month_line = next((line for line in self.content.splitlines() if 'Current month' in line), None)
        return month_line.split(':')[-1].strip() if month_line else "N/A"

    def get_project_hours(self):
        project_hours = {}
        summary_data = {}

        for line in self.content.splitlines():
            if line.startswith('*') and ':' in line:
                project_name, hours = line.split(':', 1)
                try:
                    hours_float = float(hours.strip())
                    # Separate between project symbols and summary data
                    if project_name.strip().isupper():
                        project_hours[project_name.strip('* ')] = hours_float
                    else:
                        summary_data[project_name.strip('* ')] = hours_float
                except ValueError:
                    continue

        return {
            'project_hours': project_hours,
            'summary_data': summary_data
        }
