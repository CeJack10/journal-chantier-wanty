# CLAUDE.md — Journal de Chantier WANTY / CE Rhisnes

## Projet
Application web PWA (single-file) de gestion de chantier.
- **Fichier principal** : `index.html` (~4000 lignes, tout-en-un : HTML + CSS + JS)
- **Service worker** : `sw.js` — stratégie network-first pour `index.html`
- **Déploiement** : Netlify

## Règle critique : déploiement
**Déploiement sur Netlify. À chaque modification, incrémenter le numéro de version :**

1. `sw.js` — changer `const CACHE = 'journal-wanty-vN'` → `vN+1`
2. `index.html` — changer `<!-- BUILD:vN -->` → `vN+1`

```python
import re
# Lire la version actuelle
with open('sw.js') as f: sw = f.read()
v = int(re.search(r"journal-wanty-v(\d+)", sw).group(1)) + 1
# sw.js
sw = re.sub(r"'journal-wanty-v\d+'", f"'journal-wanty-v{v}'", sw)
with open('sw.js', 'w') as f: f.write(sw)
# index.html
with open('index.html') as f: html = f.read()
html = re.sub(r'<!-- BUILD:v\d+ -->', f'<!-- BUILD:v{v} -->', html)
with open('index.html', 'w') as f: f.write(html)
print(f"Version -> v{v}")
```
Version courante : **v2**

## Architecture JS (ordre de chargement)
1. **Moteur données central** — `TACHES[]`, `parseDateFR`, `getTacheStatut`
2. **Jalons projet** — `JALONS_PROJET[]`, `JALONS_PLANNING[]`, `RESPONSABLES[]`
3. **Statuts & Types** — `JALON_TYPES{}`, `STATUT_TYPES{}`
4. **Sélecteur de semaine** — `updatePlanningWeek`, `getMondayOfISOWeek`, `initPlanningWeekSelector`
5. **Jalons & Réunions** — `renderJalons`, `jalonsSetFiltre`, `jalonsPopulateRespFilter`
6. **Fiche rapide modale** — `ouvrirFicheJalon`, `fermerFicheJalon`, `enregistrerFicheJalon`, `supprimerFicheJalon`
7. **Synthèse dynamique** — `renderSyntheseTable`, `updateSyntheseCounters`, `toggleTacheTerminee`
8. **Planning cellules** — `savePlanCell`, `loadPlanCells`, `PLAN_STORAGE_KEY`

## Liaisons automatiques (changement de semaine)
`updatePlanningWeek(weekNum)` déclenche dans l'ordre :
1. Mise à jour 6 colonnes dates (`plan-hd-0` à `plan-hd-5`)
2. `updateBypassAlert()` — bande BY-PASS rouge
3. `renderJalons(weekNum)` — tableau jalons & réunions
4. `renderTachesActivesPlanning(weekNum)` → `injecterJalonsDepuisSynthese()`
5. Label plage de dates (`#plan-semaine-label`)

## Grille planning (CSS)
- `grid-template-columns: repeat(6, 1fr)` — **6 colonnes pures** (LUN→SAM)
- Sélecteur semaine : **hors de la grille**, dans wrapper flex à droite (colonne 140px)
- `sec-label` : `grid-column: 1 / -1` (couvre les 6 colonnes)
- Chaque ligne de tâches : **exactement 6 cellules**
- Bouton `+ Jalon` intégré dans chaque `sec-label`

## Sélecteur de semaine
- Input `#plan-semaine-input` : `onchange` + `onkeydown Enter` (**PAS `oninput`**)
- Sauvegarde : `localStorage.setItem('planningWeekNum', weekNum)`
- Init : `initPlanningWeekSelector()` au chargement

## Jalons & Réunions — persistance par semaine
- Clé localStorage : `jalonsData_v2_S{weekNum}_{year}`
- Champs par ligne : `{ jour, heure, type, statut, description, responsable, lieu, entreprise, refTache, priorite, note, isProjet }`
- `isProjet:true` = non supprimable, auto-injecté depuis `JALONS_PROJET[]`
- Semaine 22 = données par défaut `JALONS_DEFAULT_S22`
- Filtres : `_jalonsFiltre = { type, resp, statut }` — `jalonsSetFiltre()`

## Statuts opérationnels (nouveaux)
`À faire` | `En cours` | `Fait` | `Bloquant` | `Reporté`
Anciens (rétrocompat) : `PLANIFIÉ` | `CRITIQUE` | `FAIT` | `ANNULÉ` | `REPORTÉ`

## Responsables
`RESPONSABLES[]` = Jean-Jacques, Stéphane Lassaux, Chef équipe S1, Chef équipe V,
Logistique, SWDE Exploitation, Bureau d'études, Coord. sécu., Sous-traitant

## Fiche rapide jalon (modale)
- ID overlay : `#jalon-modal-overlay` — classe `open` pour afficher
- Champs : `jm-jour`, `jm-heure`, `jm-type`, `jm-statut`, `jm-desc`, `jm-resp`, `jm-ligne`
- Options avancées (details/summary) : `jm-lieu`, `jm-entreprise`, `jm-tache`, `jm-priorite`, `jm-note`
- Bouton flottant : `.btn-jalon-fixe` (fixe bas-droite)
- Ouverture : `ouvrirFicheJalon(idx, prefill)` — idx=null → création, idx=number → édition

## LocalStorage — clés
| Clé | Contenu |
|-----|---------|
| `planningCells_v1` | Cellules éditables grille planning |
| `planningWeekNum` | Numéro de semaine ISO sélectionné |
| `jalonsData_v2_S{N}_{Y}` | Jalons par semaine |
| `tachesTerminees_v1` | IDs tâches marquées terminées manuellement |

## Chantier CE Rhisnes
- SWDE/BE/235/NAM/I.004762/01 — Ind. D — 220 JO
- 02/03/2026 → 01/03/2027
- Conducteur principal : Jean-Jacques | Dirigeant : Stéphane Lassaux
- By-pass actif : 11/05/26 → 21/10/26
- T45 : 01/06/26 — T21 : 08/06/26 — Vidange SWDE : 03/08/26

## Règles de codage importantes
- Ne jamais utiliser `oninput` pour le sélecteur de semaine (utiliser `onchange`)
- Ne jamais remettre le sélecteur semaine DANS la grille CSS
- `sec-label` couvre `1 / -1` (6 colonnes), jamais `1 / 7`
- Toujours bumper timestamp sw.js + index.html après chaque session
- Proposer des niveaux (P1/P2/P3) avant d'implémenter des fonctions complexes
