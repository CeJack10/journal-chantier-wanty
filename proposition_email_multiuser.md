# Proposition — Module Email & Gestion Multi-Utilisateurs
**Projet :** Journal de Chantier WANTY — CE Rhisnes  
**Date :** 24 mai 2026 | **Statut :** À valider avant implémentation

---

## PARTIE 1 — MODULE ENVOI EMAIL

### Ce qui existe déjà

L'app a déjà un bouton `📧 Envoyer par email` qui utilise `mailto:`.  
**Limite actuelle :** ouvre l'application mail du téléphone avec un texte brut — pas de pièce jointe PDF, corps limité à ~2000 caractères, dépend de l'app mail configurée.

---

### Proposition : 3 niveaux selon le besoin

#### ✅ Option A — EmailJS (recommandé) `Gratuit · 200 emails/mois`

**Principe :** un SDK JavaScript envoie l'email directement depuis le navigateur, sans serveur.  
**Résultat :** email HTML mis en forme avec tous les champs du journal, reçu dans la boîte du destinataire.

```
Navigateur (PWA)
     │
     ▼  fetch() API
EmailJS Cloud
     │
     ▼  SMTP
Boîte email WANTY / SWDE
```

**Ce que reçoit le destinataire :**
- Objet : `Journal W-002-J014 — CE Rhisnes — 24/05/2026`
- Corps HTML : tableau complet (météo, personnel, travaux, avancement, remarques)
- Pas de pièce jointe (limitation EmailJS gratuit)

**Configuration (15 min, une seule fois) :**
1. Créer compte gratuit sur emailjs.com
2. Connecter votre boîte Gmail ou Outlook WANTY
3. Copier 3 codes (Service ID, Template ID, Public Key) dans l'app
4. C'est tout

**Impact sur le code :** ajout d'un seul fichier JS (SDK EmailJS via CDN) + 30 lignes de code dans une section isolée. Zéro risque sur les fonctions existantes.

---

#### Option B — Formspree `Gratuit · 50 soumissions/mois`

**Principe :** formulaire HTML qui POST vers Formspree → ils envoient l'email.  
Plus simple à configurer, moins de contrôle sur le format.  
**Limite :** 50 emails/mois gratuits — suffisant si 1 journal/jour max.

---

#### Option C — Webhook Make/n8n → Google Sheets + email `Gratuit`

**Principe :** le journal est envoyé à un webhook Make (ex-Integromat), qui :
1. Ajoute une ligne dans Google Sheets (historique partagé)
2. Envoie un email formaté au conducteur et à la direction

**Avantage :** double bénéfice — historique cloud partagé + email automatique.  
**Limite :** nécessite un compte Make (gratuit jusqu'à 1000 opérations/mois).

---

### Recommandation

> **Option A (EmailJS)** pour l'envoi email direct, **+Option C (Make/Sheets)** si vous voulez aussi un historique cloud partagé.  
> Ces deux options sont **indépendantes** et peuvent être activées séparément.

---

### Intégration sans perturbation

L'email sera déclenché **uniquement** par un nouveau bouton `📧 Envoyer rapport` dans la section Actions, à côté du bouton PDF existant. Le comportement actuel n'est pas modifié.

```
[ 💾 Enregistrer ]  [ 📄 Exporter PDF ]  [ 📧 Envoyer rapport ]  [ 🗑 Nouveau ]
                                              ↑ nouveau bouton
```

Le module email sera dans un bloc JS séparé et commenté :
```javascript
// ═══════════════════════════════════════
//  MODULE EMAIL — EmailJS (isolé)
//  Désactivable sans impact sur le reste
// ═══════════════════════════════════════
```

---

## PARTIE 2 — GESTION MULTI-UTILISATEURS

### Le problème

Actuellement l'app est un **fichier HTML unique** avec données en **localStorage** (stockage local par appareil).  
Si plusieurs personnes modifient le code (HTML) ou utilisent l'app simultanément, risques de :
- Écrasement de modifications de code
- Journaux dupliqués ou incohérents
- Numéros de journal en collision

---

### Axe 1 — Utilisation terrain (plusieurs personnes sur le chantier)

**Problème :** Jean-Jacques et un chef de chantier utilisent chacun leur smartphone. Qui remplit le journal ? Les données ne se voient pas entre appareils.

**Solution proposée : rôles et identifiants utilisateur**

Chaque utilisateur de l'app se déclare en ouvrant l'app :

| Utilisateur | Code | Rôle | Journaux produits |
|-------------|------|------|------------------|
| Jean-Jacques | JJ | Conducteur principal | JJ-W002-J001 |
| Chef équipe S1 | S1 | Chef de chantier | S1-W002-J001 |
| Chef équipe V | EV | Chef d'équipe | EV-W002-J001 |

- Un champ "Utilisateur" en haut de l'app (select ou saisie, mémorisé)
- Le numéro de journal intègre le code utilisateur → **zéro collision**
- Chaque appareil a ses propres données → **pas d'écrasement**
- L'export backup JSON ou email permet de **consolider** en fin de semaine

---

### Axe 2 — Modifications du code source (plusieurs développeurs/contributeurs)

**Problème :** si Claude modifie le fichier en session A, et que vous redemandez une modification en session B, risque de travailler sur une version obsolète.

**Solution : GitHub + Netlify automatique**

```
Vous                Claude (Cowork)
  │                      │
  ▼                      ▼
GitHub repository ←── Push des modifications
  │
  ▼ (automatique, 30 secondes)
Netlify héberge la nouvelle version
  │
  ▼
Tous les smartphones reçoivent la mise à jour
```

**Procédure concrète :**
1. Créer un dépôt GitHub gratuit (github.com/wanty-journal ou privé)
2. Connecter Netlify à ce dépôt (1 clic)
3. À chaque modification → Claude génère le fichier → vous le commitez sur GitHub → Netlify déploie

**Avantage :** historique complet de toutes les modifications, retour en arrière possible, jamais de version perdue.

---

### Axe 3 — Règles de gestion pour l'équipe (sans GitHub)

Si GitHub est trop complexe, voici des règles simples pour éviter les conflits :

| Règle | Détail |
|-------|--------|
| **1 seul fichier maître** | Le `index.html` dans ce dossier Claude est la référence |
| **Avant toute modification** | Télécharger le fichier actuel sur Netlify, le garder en backup |
| **Après modification** | Redéployer **tous les 6 fichiers** ensemble sur Netlify |
| **Nommage des versions** | `index_v7.html`, `index_v8.html`... archiver les anciennes |
| **Journal de versions** | Tenir un fichier `VERSIONS.md` avec date + modifications |
| **Qui modifie** | Une seule personne valide les modifications (Jean-Jacques) |

---

## RÉSUMÉ — Ce que je propose de faire

### Phase 1 (immédiat — sans risque)
- Ajouter identifiant utilisateur dans l'app (champ + mémorisation)
- Numérotation journaux avec préfixe utilisateur
- Bouton `📧 Envoyer rapport` via `mailto:` amélioré (HTML dans le corps)

### Phase 2 (après validation — 30 min de configuration)
- Intégrer EmailJS pour envoi direct sans ouvrir l'app mail
- Destinataires pré-configurés (direction WANTY, conducteur, SWDE si besoin)

### Phase 3 (optionnel — si équipe > 2 personnes)
- Webhook Make → Google Sheets (historique partagé)
- GitHub pour gestion des versions du code

---

## Question pour vous avant d'avancer

1. **Email :** qui doit recevoir les rapports ? (vous seul, la direction, SWDE ?)
2. **Fréquence :** un rapport par jour ? Par semaine ?
3. **Format :** résumé texte suffit, ou voulez-vous le PDF en pièce jointe ?
4. **Utilisateurs terrain :** combien de personnes utiliseront l'app en même temps ?
5. **GitHub :** avez-vous un compte GitHub, ou préférez-vous la règle manuelle ?

Dès que vous répondez à ces 5 points, je commence l'implémentation dans l'ordre proposé.
