from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        self.stdout.write('Clearing existing data...')
        
        # Delete existing data
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()
        
        self.stdout.write('Creating teams...')
        
        # Create teams
        team_marvel = Team.objects.create(
            name='Team Marvel',
            description='Heroes from the Marvel Universe',
            members=[]
        )
        
        team_dc = Team.objects.create(
            name='Team DC',
            description='Heroes from the DC Universe',
            members=[]
        )
        
        self.stdout.write('Creating users...')
        
        # Create Marvel users
        marvel_users = [
            {'name': 'Iron Man', 'email': 'ironman@marvel.com', 'password': 'password123'},
            {'name': 'Captain America', 'email': 'captainamerica@marvel.com', 'password': 'password123'},
            {'name': 'Thor', 'email': 'thor@marvel.com', 'password': 'password123'},
            {'name': 'Black Widow', 'email': 'blackwidow@marvel.com', 'password': 'password123'},
            {'name': 'Hulk', 'email': 'hulk@marvel.com', 'password': 'password123'},
            {'name': 'Spider-Man', 'email': 'spiderman@marvel.com', 'password': 'password123'},
        ]
        
        # Create DC users
        dc_users = [
            {'name': 'Batman', 'email': 'batman@dc.com', 'password': 'password123'},
            {'name': 'Superman', 'email': 'superman@dc.com', 'password': 'password123'},
            {'name': 'Wonder Woman', 'email': 'wonderwoman@dc.com', 'password': 'password123'},
            {'name': 'Flash', 'email': 'flash@dc.com', 'password': 'password123'},
            {'name': 'Aquaman', 'email': 'aquaman@dc.com', 'password': 'password123'},
            {'name': 'Green Lantern', 'email': 'greenlantern@dc.com', 'password': 'password123'},
        ]
        
        created_users = []
        
        # Create Marvel users
        for user_data in marvel_users:
            user = User.objects.create(
                name=user_data['name'],
                email=user_data['email'],
                password=user_data['password'],
                team='Team Marvel'
            )
            created_users.append(user)
            team_marvel.members.append(user_data['name'])
        
        # Create DC users
        for user_data in dc_users:
            user = User.objects.create(
                name=user_data['name'],
                email=user_data['email'],
                password=user_data['password'],
                team='Team DC'
            )
            created_users.append(user)
            team_dc.members.append(user_data['name'])
        
        # Save teams with updated members
        team_marvel.save()
        team_dc.save()
        
        self.stdout.write('Creating activities...')
        
        # Activity types
        activity_types = ['Running', 'Cycling', 'Swimming', 'Weightlifting', 'Yoga', 'Boxing']
        
        # Create activities for each user
        for user in created_users:
            num_activities = random.randint(5, 15)
            for i in range(num_activities):
                activity_type = random.choice(activity_types)
                duration = random.randint(20, 120)  # minutes
                distance = round(random.uniform(1.0, 20.0), 2) if activity_type in ['Running', 'Cycling', 'Swimming'] else None
                calories = random.randint(100, 800)
                
                Activity.objects.create(
                    user_id=str(user._id),
                    user_name=user.name,
                    activity_type=activity_type,
                    duration=duration,
                    distance=distance,
                    calories=calories
                )
        
        self.stdout.write('Creating workouts...')
        
        # Create workouts
        workouts = [
            {
                'name': 'Super Soldier Training',
                'description': 'High-intensity workout to build strength and endurance',
                'category': 'Strength',
                'difficulty': 'Hard',
                'duration': 60,
                'calories_per_session': 600
            },
            {
                'name': 'Web Slinger Cardio',
                'description': 'Fast-paced cardio to improve agility and speed',
                'category': 'Cardio',
                'difficulty': 'Medium',
                'duration': 45,
                'calories_per_session': 450
            },
            {
                'name': 'Asgardian Warrior Workout',
                'description': 'Intense strength training for warriors',
                'category': 'Strength',
                'difficulty': 'Hard',
                'duration': 75,
                'calories_per_session': 700
            },
            {
                'name': 'Speedster Sprint',
                'description': 'Speed and endurance training',
                'category': 'Cardio',
                'difficulty': 'Medium',
                'duration': 30,
                'calories_per_session': 350
            },
            {
                'name': 'Amazon Warrior Training',
                'description': 'Combat and strength training',
                'category': 'Strength',
                'difficulty': 'Hard',
                'duration': 60,
                'calories_per_session': 550
            },
            {
                'name': 'Detective Recovery Yoga',
                'description': 'Flexibility and recovery focused yoga',
                'category': 'Flexibility',
                'difficulty': 'Easy',
                'duration': 45,
                'calories_per_session': 200
            },
            {
                'name': 'Gamma Strength Builder',
                'description': 'Maximum strength training',
                'category': 'Strength',
                'difficulty': 'Hard',
                'duration': 90,
                'calories_per_session': 800
            },
            {
                'name': 'Atlantean Swimming',
                'description': 'Swimming endurance and technique',
                'category': 'Cardio',
                'difficulty': 'Medium',
                'duration': 60,
                'calories_per_session': 500
            },
        ]
        
        for workout_data in workouts:
            Workout.objects.create(**workout_data)
        
        self.stdout.write('Creating leaderboard...')
        
        # Create leaderboard entries
        for user in created_users:
            # Calculate total activities and calories for each user
            user_activities = Activity.objects.filter(user_id=str(user._id))
            total_activities = user_activities.count()
            total_calories = sum([activity.calories for activity in user_activities])
            
            Leaderboard.objects.create(
                user_id=str(user._id),
                user_name=user.name,
                team=user.team,
                total_calories=total_calories,
                total_activities=total_activities,
                rank=0  # Will be calculated based on ordering
            )
        
        # Update ranks based on total_calories
        leaderboard_entries = Leaderboard.objects.all().order_by('-total_calories')
        for index, entry in enumerate(leaderboard_entries, start=1):
            entry.rank = index
            entry.save()
        
        self.stdout.write(self.style.SUCCESS('Successfully populated octofit_db with test data!'))
        self.stdout.write(f'Created {User.objects.count()} users')
        self.stdout.write(f'Created {Team.objects.count()} teams')
        self.stdout.write(f'Created {Activity.objects.count()} activities')
        self.stdout.write(f'Created {Workout.objects.count()} workouts')
        self.stdout.write(f'Created {Leaderboard.objects.count()} leaderboard entries')
