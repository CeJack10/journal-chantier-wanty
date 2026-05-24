[audit_app_WANTY.md](https://github.com/user-attachments/files/28199671/audit_app_WANTY.md)
# Audit technique — Journal & Planning WANTY
**Date :** 24 mai 2026 | **Fichier analysé :** `index.html` (2271 lignes, 116 Ko)

---

## 1. Ce qui est DÉJÀ implémenté ✅

| Bloc | Statut | Détail technique |
|------|--------|-----------------|
| Initialisation auto | ✅ Fait | Date du jour, semaine ISO, n° journal auto (ex: W-002-J4), client selon chantier |
| Référentiel chantiers | ✅ Fait | 3 chantiers câblés : W-001 Vivaqua, W-002 SWDE Rhisnes, W-003 SPW Wavre |
| Météo API | ✅ Fait | Open-Meteo (gratuit, sans clé) par coordonnées GPS de chaque chantier |
| Personnel dynamique | ✅ Fait | Ajout/suppression de lignes, mémoire par chantier, Jean-Jacques pré-rempli |
| Suivi matériel/livraisons | ✅ Fait | Tableau dynamique avec type, désignation, qté, unité, référence BL, statut |
| Brouillon auto | ✅ Fait | Sauvegarde toutes les 30 s dans localStorage, récupérable après fermeture |
| Validation formulaire | ✅ Fait | Champs obligatoires surlignés, messages d'erreur explicites |
| Export PDF | ✅ Fait | Génération HTML → window.print() avec mise en page chantier |
| Envoi email | ✅ Fait | mailto: avec sujet et corps préremplis (journal résumé) |
| Historique journaux | ✅ Fait | 50 journaux max stockés, affichage des 20 derniers |
| Installation PWA | ✅ Fait | manifest.json + sw.js + bannière d'installation automatique |
| Onglet Planning | ✅ Fait | Planning semaine 26–30 mai + jalons + synthèse 64 tâches CE Rhisnes |
| Mode offline | ✅ Fait | Service worker met en cache l'app pour usage sans réseau |

---

## 2. Ce qui manque ou est incomplet ❌

| Bloc | Problème | Impact terrain |
|------|----------|---------------|
| Historique : actions | Pas de bouton "Ré-imprimer PDF" ni "Supprimer" par journal | Impossible de retrouver et ré-exporter un ancien journal |
| Backup données | Pas d'export des journaux sauvegardés (localStorage = volatile si navigateur réinitialisé) | Risque de perte des 50 derniers journaux si l'app est réinstallée |
| Cloud save | `saveJournalToCloud()` = stub vide, affiche un JSON mais n'envoie rien | Le bouton "cloud" ne fait rien d'utile actuellement |
| Export CSV | Pas d'export tabulaire de l'historique | Impossible de consolider dans Excel sans recopier manuellement |
| Photos dans PDF | Photos prises dans le formulaire ne s'impriment pas toutes | Preuve photographique absente de l'export |

---

## 3. Ce qui N'EST PAS nécessaire (pour ce cas d'usage)

| Spécification reçue | Réalité terrain |
|--------------------|-----------------|
| Supabase / Firebase backend | Overkill pour 1 conducteur. localStorage + export JSON = suffisant et zéro coût. |
| React / framework JS | L'app HTML/JS vanilla fonctionne parfaitement sur smartphone. |
| Stockage cloud photos | Les photos restent en mémoire le temps de la session → incluses dans le PDF imprimé. |
| Base de données externe | Non nécessaire avant d'avoir plusieurs utilisateurs simultanés. |

---

## 4. Plan d'action — Version v4 (améliorations immédiates)

### Priorité 1 — Historique exploitable
- Ajouter bouton **📄 Ré-imprimer** par entrée de l'historique
- Ajouter bouton **🗑 Supprimer** par entrée avec confirmation
- Afficher la phase et le nombre de personnes dans chaque entrée

### Priorité 2 — Sécurité des données
- Ajouter bouton **💾 Exporter backup (JSON)** — télécharge tous les journaux en un fichier
- Ajouter bouton **📊 Exporter CSV** — tableau Excel de l'historique complet
- Afficher le nombre de journaux stockés et la taille occupée

### Priorité 3 — Cloud simple (optionnel, phase 2)
- Option A : **Webhook Make/n8n** → Google Sheets automatique (configuration 15 min)
- Option B : **Formulaire Google** en arrière-plan (zéro code, données dans Sheets)
- Option C : **Supabase** si plusieurs utilisateurs (nécessite développeur)

---

## 5. Architecture recommandée à court terme

```
Smartphone terrain
      │
      ▼
  index.html (PWA, Netlify)
      │
      ├── localStorage  ←── journaux + brouillons (jusqu'à ~5 Mo)
      │
      ├── Export JSON   ←── backup manuel vers OneDrive/email
      │
      └── window.print  ←── PDF signé + photos
```

**→ Pour CE Rhisnes, cette architecture couvre 100% des besoins jusqu'à la réception du chantier.**

---

## 6. Fichiers à déployer (inchangés)

| Fichier | Taille | Rôle |
|---------|--------|------|
| `index.html` | 116 Ko | Application complète |
| `sw.js` | 1.1 Ko | Offline / cache |
| `manifest.json` | 631 o | Métadonnées PWA |
| `icon-180.png` | 6.3 Ko | Icône iPhone |
| `icon-192.png` | 6.1 Ko | Icône Android |
| `icon-512.png` | 16 Ko | Icône splash screen |
