# Minha Rotina

Organizador pessoal de **metas, rotinas e eventos** — um app web instalável (PWA)
que funciona offline e guarda os dados no próprio dispositivo, separados por conta.

Feito em um único `index.html` (sem build, sem framework). Redesenhado mobile-first.

## ✨ Recursos

- **Planejamento** — metas macro (quantidade, páginas, tarefa), eventos com data,
  atividades únicas e rotinas recorrentes por dia da semana.
- **Hoje / Semana / Mês** — visões da agenda com marcação de _feita / não fiz / cancelada / pendente_.
- **Metas (Relatório)** — progresso consolidado, prazos, metas vencidas e em risco.
- **Widget** — visão rápida do dia com resumo e adição rápida.
- **PWA** — instalável na tela inicial, funciona offline (service worker).
- **Backup** — exportar/importar todos os dados em JSON.
- **Sincronização opcional** entre dispositivos via [Supabase](https://supabase.com) (gratuito).

## 🧱 Tecnologia

- HTML + CSS + JavaScript puro (sem dependências de build).
- `xlsx` via CDN para importar planilhas.
- Service Worker + Web App Manifest (PWA).
- Armazenamento em `localStorage` (e Supabase opcional).

## 🚀 Publicar no GitHub Pages

Este projeto é 100% estático — dá para hospedar de graça no GitHub Pages.

1. **Crie o repositório** em <https://github.com/new>
   - Nome sugerido: `minha-rotina`
   - Visibilidade: **Public** (o GitHub Pages gratuito exige repositório público).
   - Não marque "Add a README" (este projeto já tem os arquivos).

2. **Envie os arquivos** (a partir desta pasta):
   ```bash
   git init
   git branch -M main
   git add .
   git commit -m "Minha Rotina — PWA"
   git remote add origin https://github.com/SEU_USUARIO/minha-rotina.git
   git push -u origin main
   ```
   > Se já rodei `git init` + `commit` para você, comece direto no `git remote add`.

3. **Ative o Pages**: no repositório → **Settings → Pages** →
   _Build and deployment_ → **Source: Deploy from a branch** →
   Branch: **main** / **/(root)** → **Save**.

4. Aguarde ~1 minuto. O app fica disponível em:
   ```
   https://SEU_USUARIO.github.io/minha-rotina/
   ```

5. No celular, abra esse endereço e use **Instalar app** (Android/Chrome) ou
   **Compartilhar → Adicionar à Tela de Início** (iOS/Safari).

## 💻 Rodar localmente

Como o app usa service worker, sirva por HTTP (não abra o arquivo direto):

```bash
npx serve .
# ou
python -m http.server 8080
```

Depois acesse `http://localhost:3000` (ou a porta indicada).

## 🔒 Privacidade

Os dados ficam **no seu dispositivo** (`localStorage`), separados por conta.
Nenhum dado pessoal é embutido no código — cada pessoa cria a própria conta.
A sincronização com Supabase é **opcional** e configurada por você.

> Migrando de uma versão anterior? Exporte seus dados no app antigo
> (**Configurações → Baixar JSON**) e reimporte aqui em **Configurações → Importar dados**.

## ☁️ Sincronização entre dispositivos (opcional)

Na tela de login, use **"Configurar sincronização entre dispositivos"** e siga os passos
(criar projeto no Supabase, rodar o SQL exibido, colar _Project URL_ + _anon key_).
