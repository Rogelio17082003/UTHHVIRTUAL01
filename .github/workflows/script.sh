name: Hola Mundo

on: [push]

jobs:
  uno:
    runs-on: ubuntu-latest
    steps:
      - name: Mensaje
        run: echo "Hola mundo!!!"
        
      - name: Touch file  # Crea
        run: |
          touch hola.txt
          ls -al
          
      - name: Set text  # Agrega
        run: |
          echo "Hola mundo" >> hola.txt
          ls -al
          
      - name: Read file  # Lee
        run: |
          cat hola.txt
          ls -al

  dos:
    runs-on: ubuntu-latest
    needs: [uno]
    steps:
      - name: Checkout
        uses: actions/checkout@v4.2.1

      - name: Directorio
        run: ls -al

      - name: Instalar
        run: |
          cd .github/workflows
          ls -al
          chmod +x script.sh
          ls -al
          ./script.sh