# 🥩 ProteinWatts — Assistant de Cuisson Éco-Protéines

ProteinWatts est une application web PWA légère conçue pour optimiser la cuisson des **œufs** et des **viandes** en combinant réduction d'énergie (jusqu'à 70%) et préservation des qualités organoleptiques et nutritionnelles.

---

## 🔬 Fondements Biochimiques et Thermiques

### 1. Dénaturation des Protéines & Retenue de l'Eau
- **Œufs (Ovalbumine, Conalbumine) :** La coagulation commence à 62°C pour le blanc et 65°C pour le jaune. Une cuisson constante à 100°C brise le réseau protéique, entraînant la perte d'eau et une texture caoutchouteuse. La cuisson passive (eau bouillie puis feu coupé) assure une descente thermique douce, maintenant le jaune fluide ou crémeux.
- **Viandes (Myosine & Actine) :** La myosine coagule à 50-55°C (viande tendre/saignante) tandis que l'actine coagule à 66-70°C (durcissement des fibres). En coupant le feu et en utilisant un couvercle hermétique, l'inertie thermique termine la cuisson sans dépasser le seuil d'exsudation critique.

### 2. Protection Nutritionnelle
- **Vitamines & Minéraux :** La cuisson à basse température et par absorption/vapeur sous couvercle protège les vitamines sensibles du groupe B (notamment B9 et B12) et garde le fer héminique intact dans les jus retenus.
- **Sécurité et Anti-Toxiques :** Évite les températures excessives (>180°C) responsables de la formation d'Amines Hétérocycliques (AHC) et de Produits de Glycation Avancée (AGE).

---

## ⚙️ Algorithme Thermal de l'Application

ProteinWatts ajuste les temps de repos hors du feu en se basant sur :
1. **La masse / le calibre :** Calcul par conduction thermique proportionnel à $M^{2/3}$ pour adapter la pénétration de la chaleur au cœur de l'aliment.
2. **Le volume d'eau minimal :** Réduction de la quantité d'eau pour n'utiliser que la vapeur piégée sous couvercle.
3. **L'inertie des récipients :** Ajustement du temps selon la capacité thermique des fonds de casseroles (fonte/inox vs aluminium fin).

---

## 🛠️ Fichiers du Projet

- `index.html` : Structure et formulaire dynamique.
- `app.js` : Moteur de calcul thermodynamique, timers et PWA local storage.
- `manifest.json` : Configuration PWA pour installation mobile/desktop.
- `readme.html` & `readme.md` : Guide d'utilisation et principes nutritionnels.

---

🌱 **ProteinWatts** — *Cuisiner les protéines intelligemment en exploitant la chaleur résiduelle.*
