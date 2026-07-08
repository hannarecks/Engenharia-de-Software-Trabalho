# modulo_8 — Gestão de Contratos

SPA em Vue 2 + Vuetify que fala direto com o Supabase (não há backend próprio). Veja a arquitetura completa em [`../docs/DAS.md`](../docs/DAS.md).

## Configuração

1. Copie `.env.example` para `.env` e preencha com os dados do seu projeto Supabase (Project Settings → API → "Project URL" e "anon public key").
2. Rode `mod8_schema.sql` no SQL Editor do Supabase para criar as tabelas, triggers e políticas de RLS.
3. (Opcional) Rode `mod8_seed_teste.sql` para popular dados de teste — veja os comentários no início do arquivo para o UUID de usuário esperado.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
