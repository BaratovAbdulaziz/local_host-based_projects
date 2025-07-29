import os
import sys
import shelve

def add():
    '''Function to add new password'''
    website_name = input("Enter website address:\n> ").strip()
    username = input("What was the username you used?\n> ").strip()
    password = input("What is the password?\n> ").strip()

    with shelve.open("passwords") as file:
        file[website_name] = {'username': username, 'password': password}
    print("✅ Password saved successfully!\n")

def lists():
    '''Function to list all stored passwords'''
    with shelve.open("passwords") as file:
        if len(file) == 0:
            print("📂 No passwords stored yet.\n")
            return
        print("📋 Stored Passwords:")
        for website, creds in file.items():
            print(f"🔹 {website}: Username: {creds['username']}, Password: {creds['password']}")
        print()

def remove():
    '''Function to remove a stored password'''
    website = input("Enter the website to delete its password:\n> ").strip()
    with shelve.open("passwords") as file:
        if website in file:
            del file[website]
            print(f"🗑️ Password for '{website}' deleted successfully.\n")
        else:
            print("⚠️ No such website found.\n")

def menu():
    '''Main menu for the program'''
    while True:
        print("🔐 Password Manager")
        print('''
Options:
    [A] Add a new password
    [L] List all passwords
    [?] Remove a password
    [Q] Quit
''')
        answer = input("Choose an option:\n> ").strip().upper()

        if answer == "A":
            add()
        elif answer == "L":
            lists()
        elif answer == "?":
            remove()
        elif answer == "Q":
            print("👋 Goodbye!")
            sys.exit()
        else:
            print("❌ Invalid option. Please try again.\n")

if __name__ == "__main__":
    menu()
