def main():
    '''Main function'''

    print('''
**Welcome to The game PIG**
      [Hope you know the rules!!!]
      But whatever, here are the rules:

      - Each turn, a player repeatedly rolls a die until either:
          a) They roll a 1 (and lose all points for that turn), or
          b) They choose to "hold" (and add the turn total to their score).
      - First player to reach 100 points wins.
      - Rolling a 1 ends your turn with 0 points added.
      - You can hold at any time to save your points.
''')

    import random
    final_scores = {}
    playing_players = int(input("How many players are there? "))

    # Get player names
    for i in range(1, playing_players + 1):
        while True:
            name = input(f"Enter name of player {i}: ")
            if name.isdigit() or name in final_scores:
                print("Error: Name must be unique and non-numeric. Try again.")
            else:
                final_scores[name] = 0
                break

    # Game loop
    game_over = False
    while not game_over:
        for name in final_scores:
            print(f"\n{name}'s turn!")
            turn_score = 0

            while True:
                die = random.randint(1, 6)
                print(f"{name} rolled a {die}")

                if die == 1:
                    print("Oops! Rolled a 1. Turn over. No points added.")
                    turn_score = 0
                    break

                turn_score += die
                print(f"Turn score: {turn_score}")
                print(f"Total score if held: {final_scores[name] + turn_score}")

                choice = input("Roll again or hold? (r/h): ").lower()
                while choice not in ('r', 'h'):
                    choice = input("Please type 'r' to roll or 'h' to hold: ").lower()

                if choice == 'h':
                    print(f"{name} holds with {turn_score} points.")
                    break

            final_scores[name] += turn_score
            print(f"{name}'s total score: {final_scores[name]}")

            if final_scores[name] >= 100:
                print(f"\n🎉🎉 {name} WINS with {final_scores[name]} points! 🎉🎉")
                game_over = True
                break

    print("\n=== Final Scores ===")
    for name, score in final_scores.items():
        print(f"{name}: {score} points")


if __name__ == "__main__":
    main()
