class LogTemplate:
    def __init__(self, content):
        self.content = content

    def get_current_month(self):
        """Extract the current month from the log file."""
        raise NotImplementedError

    def get_project_hours(self):
        """Extract project symbols and hours."""
        raise NotImplementedError

    def parse(self):
        # Parse data from the content
        parsed_data = {
            'current_month': self.get_current_month(),
            'project_hours': self.get_project_hours()['project_hours']
        }

        # Extract the summary data separately
        summary_data = self.get_project_hours()['summary_data']
        parsed_data['expected_worked_hours'] = summary_data.get('Expected worked hours in a period')
        parsed_data['worked_hours'] = summary_data.get('Worked hours in a period')

        return parsed_data
