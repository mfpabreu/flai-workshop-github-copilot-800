from rest_framework import serializers
from .models import User, Team, Activity, Leaderboard, Workout
from bson import ObjectId
import ast


class ObjectIdField(serializers.Field):
    """Custom field to convert ObjectId to string"""
    def to_representation(self, value):
        return str(value)
    
    def to_internal_value(self, data):
        return ObjectId(data)


class UserSerializer(serializers.ModelSerializer):
    _id = ObjectIdField(read_only=True)
    
    class Meta:
        model = User
        fields = ['_id', 'name', 'email', 'password', 'team', 'created_at']
        extra_kwargs = {'password': {'write_only': True}}


class TeamSerializer(serializers.ModelSerializer):
    _id = ObjectIdField(read_only=True)
    members = serializers.SerializerMethodField()

    def get_members(self, obj):
        members = obj.members
        if isinstance(members, list):
            return members
        if isinstance(members, str):
            try:
                parsed = ast.literal_eval(members)
                return parsed if isinstance(parsed, list) else []
            except (ValueError, SyntaxError):
                return [m.strip() for m in members.split(',') if m.strip()]
        return []

    class Meta:
        model = Team
        fields = ['_id', 'name', 'description', 'members', 'created_at']


class ActivitySerializer(serializers.ModelSerializer):
    _id = ObjectIdField(read_only=True)
    
    class Meta:
        model = Activity
        fields = ['_id', 'user_id', 'user_name', 'activity_type', 'duration', 'distance', 'calories', 'date']


class LeaderboardSerializer(serializers.ModelSerializer):
    _id = ObjectIdField(read_only=True)
    
    class Meta:
        model = Leaderboard
        fields = ['_id', 'user_id', 'user_name', 'team', 'total_calories', 'total_activities', 'rank']


class WorkoutSerializer(serializers.ModelSerializer):
    _id = ObjectIdField(read_only=True)
    
    class Meta:
        model = Workout
        fields = ['_id', 'name', 'description', 'category', 'difficulty', 'duration', 'calories_per_session']
