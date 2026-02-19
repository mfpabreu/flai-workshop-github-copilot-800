from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import User, Team, Activity, Leaderboard, Workout


class UserAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_user(self):
        data = {
            'name': 'Test User',
            'email': 'testuser@example.com',
            'password': 'securepassword',
            'team': 'Team Alpha',
        }
        response = self.client.post('/api/users/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'Test User')

    def test_list_users(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class TeamAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_team(self):
        data = {
            'name': 'Team Alpha',
            'description': 'Best fitness team',
            'members': [],
        }
        response = self.client.post('/api/teams/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'Team Alpha')

    def test_list_teams(self):
        response = self.client.get('/api/teams/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ActivityAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_activity(self):
        data = {
            'user_id': 'user123',
            'user_name': 'Test User',
            'activity_type': 'Running',
            'duration': 30,
            'distance': 5.0,
            'calories': 300,
        }
        response = self.client.post('/api/activities/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['activity_type'], 'Running')

    def test_list_activities(self):
        response = self.client.get('/api/activities/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class LeaderboardAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_leaderboard_entry(self):
        data = {
            'user_id': 'user123',
            'user_name': 'Test User',
            'team': 'Team Alpha',
            'total_calories': 1500,
            'total_activities': 10,
            'rank': 1,
        }
        response = self.client.post('/api/leaderboard/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['user_name'], 'Test User')

    def test_list_leaderboard(self):
        response = self.client.get('/api/leaderboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class WorkoutAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_workout(self):
        data = {
            'name': 'Morning Run',
            'description': 'A light morning run',
            'category': 'Cardio',
            'difficulty': 'Easy',
            'duration': 30,
            'calories_per_session': 250,
        }
        response = self.client.post('/api/workouts/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'Morning Run')

    def test_list_workouts(self):
        response = self.client.get('/api/workouts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class APIRootTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_api_root(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('users', response.data)
        self.assertIn('teams', response.data)
        self.assertIn('activities', response.data)
        self.assertIn('leaderboard', response.data)
        self.assertIn('workouts', response.data)

    def test_api_root_prefix(self):
        response = self.client.get('/api/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
