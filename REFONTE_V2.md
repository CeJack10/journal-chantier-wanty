# Refonte Journal WANTY — V2

**Date de validation :** 04/06/2026  
**Statut :** Validé — implémentation P1 active

---

## Principes directeurs validés

- **3 couches de saisie :** obligatoire visible / assisté visible / avancé replié
- **Objectif terrain :** journal exploitable en 2–3 min, enrichissable ensuite
- **Une seule source par information :** supprimer les doublons fonctionnels
- **Chaque saisie génère une suite :** tâche, jalon, relance, export

---

## Décisions champ par champ

| Bloc / champ | Décision | Statut |
|---|---|---|
| Date, Semaine, Gestionnaire | Garder | ✅ |
| Chantier, Client | Garder | ✅ |
| N° journal | Corrigé — format AAAAMMJJSÉQ | ✅ V2 fait |
| Zone / lot | Renommé, structuré | ✅ V2 fait |
| Météo auto | Garder | ✅ |
| Intempérie + heures perdues | Conditionnel (si intempérie = oui) | 🔧 P1 |
| Statut du journal | Ajouté (brouillon/à valider/validé/diffusé) | 🔧 P1 |
| Personnel — Fonction | Liste normalisée à la place du texte semi-libre | ✅ existe |
| Bouton "Même équipe qu'hier" | Ajouté | 🔧 P1 |
| Travaux du jour | Garder — texte principal | ✅ |
| Travaux de demain | + bouton "Créer tâche J+1" | 🔧 P1 |
| Blocages / réserves | + catégorie obligatoire | 🔧 P1 |
| Engins présents (texte libre) | Fusionner dans le tableau logistique | 🔧 P1 |
| Tableau matériel/livraisons | Garder — meilleur format actuel | ✅ |
| Livraisons reçues (texte libre) | Redondant — remplacé par tableau | 🔧 P1 |
| Observations livraison (global) | Déplacé ligne par ligne dans le tableau | 🔧 P1 |
| Topo (tous champs) | Garder, replié | ✅ |
| Sécurité / incidents / visiteurs | Garder | ✅ |
| Photos | Garder | ✅ |
| Légende photos (par photo) | P2 — complexité JS | ⏳ P2 |
| Remarques & notes libres | Renommé "Transmission / remarques" | 🔧 P1 |
| Signature | Garder | ✅ |
| Brouillons | Garder | ✅ |
| Avancement curseur global | Garder + optionnel lignes structurées | ✅ curseur / ⏳ lignes P2 |

---

## Ce qui est déporté (hors V2)

| Idée | Pourquoi reporté |
|---|---|
| Journal vocal IA | Requiert API externe + backend — incompatible PWA fichier unique |
| Export auto SharePoint / mail | Requiert backend — hors périmètre Netlify |
| Rapport mensuel auto | P3 — complexité, peu urgent |
| Lignes de travaux par poste/quantité | P2 — valeur réelle mais friction à évaluer |
| Légende par photo individuelle | P2 — refactoring JS photos |
| Bibliothèques internes par chantier | P2 — utile mais non bloquant |
| Avancement par poste (remplacement curseur) | Déconseillé en remplacement — trop de friction terrain |

---

## Implémentation P1 — fait dans cette session (v3)

- [x] Statut journal : brouillon / à valider / validé / diffusé
- [x] Bouton "Même équipe qu'hier"
- [x] Blocages : ajout catégorie (plan / appro / météo / accès / qualité / sous-traitant / client)
- [x] Travaux de demain : bouton "Créer tâche J+1" → injecte dans planning
- [x] Fusion champ texte "Engins présents" dans le tableau logistique (champ libre supprimé)
- [x] Champ "Livraisons reçues" texte libre → remplacé par note tableau
- [x] "Remarques & notes libres" → "Transmission / remarques"
- [x] Labels clés mis à jour (zone/lot, responsable, phase, travaux du jour, blocages)
- [x] Intempérie → heures perdues conditionnelles (alerte si vide)

---

## Libellés de référence (extrait)

Voir `labels_v2.json` pour le dictionnaire complet.

Règle : **label = 2–4 mots · placeholder = exemple concret · erreur = direct sans jargon**

---

## Version suivante (P2 — à planifier)

- Lignes de travaux structurées (zone / phase / qté / unité)
- Légende par photo individuelle
- Bibliothèques internes : phases, engins, matériaux, types de blocage
- Préremplissage J-1 : copier équipe / matériel du journal précédent
- Avancement par poste (optionnel, en plus du curseur global)

---

*Document de référence interne — ne pas supprimer*
