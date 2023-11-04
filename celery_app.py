from django.conf import settings

import os
import time

from celery import Celery


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'MovieFusion.settings')

app = Celery('MovieFusion')
app.config_from_object('django.conf:settings')
app.conf.broker_url = settings.CELERY_BROKER_URL
app.autodiscover_tasks()


@app.task()
def debug_task():
    time.sleep(20)
    print('Hello from debug task')