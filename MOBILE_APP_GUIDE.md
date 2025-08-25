# Guia de Lançamento para App Móvel (iOS/Android)

Este documento detalha o processo para empacotar a aplicação web React (prospectRadar) em um aplicativo nativo para iOS e Android, permitindo a publicação na Apple App Store e Google Play Store.

A estratégia utilizada é o **Capacitor**, que "envolve" a aplicação web em um contêiner nativo, reutilizando 100% do código e da interface já construídos.

---

## Passo 0: Configuração Inicial (Já Realizada)

As etapas a seguir já foram executadas para preparar o projeto. Elas estão documentadas aqui para referência futura.

1.  **Instalação do Capacitor:**
    ```bash
    # Instala o Core e a ferramenta de linha de comando (CLI)
    npm install @capacitor/core
    npm install -D @capacitor/cli
    ```

2.  **Inicialização do Projeto Capacitor:**
    *   O comando `npx cap init prospectRadar com.prospectradar.app --web-dir "dist"` foi executado.
    *   Isso criou o arquivo `capacitor.config.json`, que configura o Capacitor para usar a pasta `dist` (gerada pelo Vite) como o diretório do aplicativo web.

3.  **Instalação das Plataformas Nativas:**
    ```bash
    npm install @capacitor/android @capacitor/ios
    ```

4.  **Criação dos Projetos Nativos:**
    *   O comando `npx cap add android && npx cap add ios` foi executado.
    *   Isso criou as pastas `/android` e `/ios` na raiz do projeto. Cada uma contém um projeto nativo completo (um para Android Studio e outro para Xcode).

---

## O Fluxo de Trabalho de Desenvolvimento

A partir de agora, para trabalhar na versão móvel, o ciclo de desenvolvimento será o seguinte:

### Passo 1: Construir a Aplicação React

Toda vez que você fizer alterações no código-fonte React (componentes, páginas, hooks, etc.), você precisa gerar a versão de produção otimizada do seu app.

```bash
npm run build
```

Este comando compila seu código e cria a pasta `/dist` com os arquivos estáticos (HTML, CSS, JS) que o Capacitor usará.

### Passo 2: Sincronizar com as Plataformas Nativas

Após cada `build`, você deve copiar a nova versão do seu app web para dentro dos projetos nativos de Android e iOS.

```bash
npx cap sync
```

Este comando atualiza as pastas `/android` and `/ios` com o conteúdo mais recente da sua pasta `/dist`.

### Passo 3: Abrir e Testar nos IDEs Nativos

É aqui que você testará e verá o aplicativo funcionando como um app móvel de verdade.

1.  **Para Android:**
    ```bash
    npx cap open android
    ```
    Este comando abrirá o projeto na IDE **Android Studio**. De lá, você pode iniciar o aplicativo em um emulador de Android ou em um dispositivo físico conectado ao seu computador.

2.  **Para iOS:**
    *   **Requisito:** É necessário ter um computador com **macOS e Xcode** instalado.
    ```bash
    npx cap open ios
    ```
    Este comando abrirá o projeto na IDE **Xcode**. De lá, você pode iniciar o aplicativo em um simulador de iPhone ou em um dispositivo físico.

### Passo 4: Gerar Ícones e Telas de Abertura (Splash Screen)

O Capacitor oferece uma ferramenta para gerar automaticamente todos os tamanhos de ícones e splash screens necessários para cada plataforma a partir de uma única imagem.

1.  **Crie os arquivos de origem:**
    *   **Ícone:** Crie uma imagem de `1024x1024px` e salve-a como `assets/icon.png`.
    *   **Splash Screen:** Crie uma imagem de `2732x2732px` e salve-a como `assets/splash.png`.

2.  **Instale a ferramenta de assets (se ainda não tiver):**
    ```bash
    npm install -D @capacitor/assets
    ```

3.  **Execute o gerador:**
    ```bash
    npx capacitor-assets generate
    ```
    A ferramenta irá criar e posicionar todos os arquivos de imagem necessários dentro das pastas `/android` e `/ios`.

### Passo 5: Publicação nas Lojas

Esta é a etapa final para colocar seu aplicativo nas mãos dos usuários.

1.  **Crie Contas de Desenvolvedor:**
    *   **Google Play Store:** Requer uma conta no [Google Play Console](https://play.google.com/console/signup/) (taxa única de $25).
    *   **Apple App Store:** Requer uma assinatura no [Apple Developer Program](https://developer.apple.com/programs/enroll/) ($99 por ano).

2.  **Gere os Pacotes de Publicação:**
    *   **Android (no Android Studio):** Use a opção do menu `Build > Generate Signed Bundle / APK...`. O formato recomendado é **AAB (Android App Bundle)**. Você precisará criar uma chave de assinatura na primeira vez.
    *   **iOS (no Xcode):** Use a opção do menu `Product > Archive`. Isso irá compilar e empacotar seu aplicativo para distribuição.

3.  **Envie para Revisão:**
    *   Faça o upload do seu arquivo `.aab` (Android) ou do pacote arquivado (iOS) para o painel de controle de cada loja.
    *   Preencha todos os metadados necessários: nome do app, descrição, screenshots, política de privacidade, etc.
    *   Envie o aplicativo para o processo de revisão de cada loja.
