from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.models import User

class RegisterForm(UserCreationForm):
    email = forms.EmailField(max_length=200, help_text="Enter a valid email")
    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')
        
class LoginForm(AuthenticationForm):
    username = forms.CharField(label='username')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.pop('autofocus', None)
        self.fields['username'].label = 'username'
    class Meta:
        model = User
        fields = ['username', 'password']