pip install pygame
import pygame
import random

# Initialisation
pygame.init()

# Taille de la fenêtre
WIDTH, HEIGHT = 800, 600
WIN = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Pong - 1 joueur contre l'IA")

# Couleurs
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

# Paramètres
PADDLE_WIDTH, PADDLE_HEIGHT = 10, 100
BALL_RADIUS = 7
FPS = 60
SPEED = 7

# Joueur et IA
player = pygame.Rect(10, HEIGHT//2 - 50, PADDLE_WIDTH, PADDLE_HEIGHT)
opponent = pygame.Rect(WIDTH - 20, HEIGHT//2 - 50, PADDLE_WIDTH, PADDLE_HEIGHT)
ball = pygame.Rect(WIDTH//2, HEIGHT//2, BALL_RADIUS*2, BALL_RADIUS*2)

ball_speed_x = SPEED * random.choice((1, -1))
ball_speed_y = SPEED * random.choice((1, -1))

# Boucle de jeu
run = True
clock = pygame.time.Clock()

def draw():
    WIN.fill(BLACK)
    pygame.draw.rect(WIN, WHITE, player)
    pygame.draw.rect(WIN, WHITE, opponent)
    pygame.draw.ellipse(WIN, WHITE, ball)
    pygame.draw.aaline(WIN, WHITE, (WIDTH//2, 0), (WIDTH//2, HEIGHT))
    pygame.display.flip()

while run:
    clock.tick(FPS)

    # Gestion des événements
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            run = False

    # Mouvements du joueur
    keys = pygame.key.get_pressed()
    if keys[pygame.K_UP] and player.top > 0:
        player.y -= SPEED
    if keys[pygame.K_DOWN] and player.bottom < HEIGHT:
        player.y += SPEED

    # Mouvement IA simple
    if opponent.top < ball.y:
        opponent.y += SPEED - 2
    if opponent.bottom > ball.y:
        opponent.y -= SPEED - 2

    # Mouvements de la balle
    ball.x += ball_speed_x
    ball.y += ball_speed_y

    # Collision avec le haut et le bas
    if ball.top <= 0 or ball.bottom >= HEIGHT:
        ball_speed_y *= -1

    # Collision avec les raquettes
    if ball.colliderect(player) or ball.colliderect(opponent):
        ball_speed_x *= -1

    # Réinitialiser si la balle sort
    if ball.left <= 0 or ball.right >= WIDTH:
        ball.center = (WIDTH//2, HEIGHT//2)
        ball_speed_x *= random.choice((-1, 1))
        ball_speed_y *= random.choice((-1, 1))

    draw()

pygame.quit()
