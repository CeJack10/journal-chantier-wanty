# Journal WANTY — V13 Clean

**Version:** v13 (Cache v14)  
**Date:** 18 juin 2026  
**Status:** Production ready

## 📁 Fichiers

- `index.html` — PWA complète (~408 KB) — Monolithique
- `sw.js` — Service Worker v14
- `manifest.json` — PWA metadata
- `icon-*.png` — 180, 192, 512 px (iOS + Android)
- `CLAUDE.md` — Règles de codage + déploiement
- `PLANNING_HOMMES.md` — Module Planning Hommes docs

## 🚀 Déploiement Netlify

```bash
# 1. Copier ce dossier vers le repo Git
cp -r journal-wanty-v13-clean/* journal-chantier-wanty/

# 2. Push vers GitHub
git add .
git commit -m "Deploy V13 clean"
git push origin main

# 3. Netlify redéploie automatiquement
```

## ✅ Production Checklist

- ✓ Zéro fichiers résiduels (supabase.js, test-*.html supprimés)
- ✓ Cache v14 (Service Worker + index.html)
- ✓ Planning Hommes complet (CRUD hommes, autocomplétion, preview import)
- ✓ localStorage isolation (wanty_workers, wanty_allocations, wanty_allocation_history)
- ✓ Titre module éditable + sauvegardé

## 🔧 Modules Implémentés

### Planning Hommes V1
- Grille 7j × N workers (orange = réservé)
- Historique avec dates françaises lisibles
- Détection conflit automatique
- Déblocage par code SHA-256
- Export/Import JSON avec preview
- **Nouveau:** Gestion complète des hommes (ajouter/éditer/supprimer)
- **Nouveau:** Input libre + autocomplétion intelligente

### Autres onglets
- ✓ Journal (pas de régression)
- ✓ Planning Semaine (pas de régression)
- ✓ Synthèse Globale (pas de régression)

## 📝 Notes

- PWA offline-first (Service Worker)
- localStorage pour persistence
- Aucune dépendance externe
- Code vanille HTML/CSS/JS

---

**Créé par:** Claude Code Agent  
**Prêt pour production ✓**
