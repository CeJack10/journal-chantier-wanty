# Planning Hommes — Module V1

**Status :** En développement (MVP)  
**Date :** 14 juin 2026  
**Version :** v10 (cache)

---

## 📋 État actuel

### ✅ Fonctionnalités implémentées

- **StorageAdapter localStorage** : 7 fonctions (fetch/save allocations, workers, history, export/import)
- **HTML complet** : Tab + formulaire + grille + modales + historique
- **Grille d'allocation** : 3 workers × 7 jours, visual conflict (orange pour réservé)
- **Formulaire réservation** : Sélecteur homme, site, dates début/fin
- **Détection conflit** : Chevauchement de dates = modal alerting + bouton "Demander déblocage"
- **Code déblocage** : Génération SHA-256 (4 chiffres), vérification avec hash
- **Export/Import** : Télécharge/upload JSON pour sync multi-device
- **Titre éditable** (Point 4) : Cliquer → éditer → sauvegardé en localStorage

### ⚠️ Manquements identifiés

| Point | Statut | Description |
|-------|--------|-------------|
| **1. Données de test incorrectes** | ❌ TODO | Worker "Pierre Durand" au lieu de "Stéphane Lassaux"; historique affiche "Invalid Date" |
| **2. Grille trop basique** | ❌ TODO | Cases affichent juste "—"; pas de clic pour voir détails; besoin nom allocation/statut visible |
| **3. Historique mal formaté** | ❌ TODO | "create par undefined"; dates cassées (Invalid Date); colonnes mal alignées |
| **4. Titre éditable** | ✅ DONE | Titre maintenant contenteditable + sauvegardé en localStorage |

---

## 🔧 Corrections à faire (dans l'ordre)

### Point 1 : Données de test correctes

**Lieu :** Fonction `initTestData()` (ligne ~5100)

**Changements :**
- Worker: `name: 'Stéphane Lassaux'` (au lieu de Pierre Durand)
- Allocations: dates correctes (16-22 juin, 20-26 juin pour chevauchement)
- Historique: `timestamp: new Date().toISOString()` (correct format ISO)

**Résultat attendu :**
- Grille: Jean Dupont orange sur 16-26 juin
- Historique: dates lisibles (14 juin 2026 05:12:29)

---

### Point 2 : Grille améliorée

**Lieu :** Fonction `renderGrid()` (ligne ~5186)

**Changements :**
- Remplacer "—" par le nom court de l'allocation si présente
- Ou afficher un badge cliquable pour voir les détails
- Colorer les cases selon le statut (reserved = orange, occupied = red)

**Exemple :**
```
Jean Dupont | JD-16 | JD-16 | JD-16 | JD-16 | JD-16 | JD-16 | —
```

---

### Point 3 : Historique bien formaté

**Lieu :** Fonction `renderHistory()` (ligne ~5216)

**Changements :**
- Afficher `worker_name` au lieu de "—"
- Formater `timestamp` en français lisible (ex: "14 juin 2026 05:12:29")
- Afficher action lisible ("✓ Créée" au lieu de "allocation_created")
- Aligner colonnes proprement

**Résultat attendu :**
```
Jean Dupont | 16/06→22/06 | ✓ Réservé | Créée par JJ | 14 juin 05:12
Jean Dupont | 20/06→26/06 | ✓ Réservé | Créée par SL | 14 juin 05:12
```

---

## 🚀 Prochaines étapes

1. **Point 1** : Corriger initTestData() → 10 min
2. **Point 2** : Améliorer renderGrid() → 20 min
3. **Point 3** : Formater renderHistory() → 20 min
4. **Test complet** : E2E sur Netlify → 15 min
5. **Déploiement final** → 5 min

**Durée estimée :** ~70 min

---

## 🧪 Checklist de test (à faire après corrections)

- [ ] **Données de test** : Jean Dupont visible avec conflit 16-26 juin (orange)
- [ ] **Grille lisible** : Noms allocations clairs, couleurs distinctes
- [ ] **Historique lisible** : Dates, acteurs, actions tous visibles
- [ ] **Réservation** : Ajouter Paul Martin 1-5 juillet → OK, grille update
- [ ] **Conflit** : Ajouter Jean Dupont 21-24 juin → Modal conflit
- [ ] **Déblocage** : Générer code → 4 chiffres visibles → Vérifier avec code
- [ ] **Export/Import** : Télécharger JSON → modifier → uploader → OK
- [ ] **Titre** : Éditer → Reload → Titre persiste
- [ ] **Console** : Zéro erreurs (sauf si intentionnel)

---

## 📝 Notes développement

- StorageAdapter isolated = remplaçable par Supabase plus tard
- SHA-256 pour code (pas HMAC, MVP)
- Fail-silent pattern (erreurs n'affichent pas grille)
- localStorage keys : `wanty_workers`, `wanty_allocations`, `wanty_allocation_history`

---

**Créé par :** Claude Code Agent  
**Dernière mise à jour :** 14 juin 2026 05:30
