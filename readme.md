# 🥩 Prot-in-Watts — Assistant de Cuisson Éco-Protéines

Prot-in-Watts est une application web PWA légère conçue pour optimiser la cuisson des **œufs**, des **viandes** et des **poissons / crustacés** en combinant réduction d'énergie (jusqu'à 70%) et préservation des qualités organoleptiques et nutritionnelles.

---

## 🔬 Fondements Biochimiques et Thermiques

### 1. Dénaturation des Protéines & Retenue de l'Eau
- **Œufs (Ovalbumine, Conalbumine) :** La coagulation commence à 62°C pour le blanc et 65°C pour le jaune. Une cuisson constante à 100°C brise le réseau protéique, entraînant la perte d'eau et une texture caoutchouteuse. La cuisson passive (eau bouillie puis feu coupé) assure une descente thermique douce, maintenant le jaune fluide ou crémeux.
- **Viandes (Myosine & Actine) :** La myosine coagule à 50-55°C (viande tendre/saignante) tandis que l'actine coagule à 66-70°C (durcissement des fibres). En coupant le feu et en utilisant un couvercle hermétique, l'inertie thermique termine la cuisson sans dépasser le seuil d'exsudation critique.
- **Poissons & Crustacés (Myofibrilles & Collagène) :** Les chairs de poisson contiennent très peu de collagène (environ 3 % contre 15 % pour la viande) et ce collagène se solubilise dès 45-50°C. Les protéines musculaires (myosine) se solidifient très rapidement dès 50°C. Une cuisson à feu coupé ou à la vapeur douce évite l'assèchement des fibres et la perte des jus de structure.

### 2. Protection Nutritionnelle
- **Acides Gras & Omega-3 :** Chez les poissons gras (saumon, maquereau), la cuisson passive hors du feu protège les acides gras polyinsaturés (EPA et DHA) de l'oxydation thermique.
- **Vitamines & Minéraux :** La cuisson à température modérée et sous couvercle protège les vitamines thermolabiles du groupe B (B9, B12) ainsi que la vitamine D des poissons.
- **Sécurité et Anti-Toxiques :** Évite les températures excessives (>180°C) responsables de la formation d'Amines Hétérocycliques (AHC) et de Produits de Glycation Avancée (AGE).

---

## ⚙️ Algorithme Thermal de l'Application

Prot-in-Watts ajuste les temps de repos hors du feu en se basant sur :
1. **La masse / le calibre :** Calcul par conduction thermique proportionnel à M^2/3 pour adapter la pénétration de la chaleur au cœur de l'aliment.
2. **Le volume d'eau minimal :** Réduction de la quantité d'eau pour n'utiliser que la vapeur piégée sous couvercle.
3. **L'inertie des récipients :** Ajustement du temps selon la capacité thermique des fonds de casseroles (fonte/inox vs aluminium fin).

---

## 🛠️ Fichiers du Projet

- `index.html` : Structure et formulaire dynamique.
- `app.js` : Moteur de calcul thermodynamique, timers et PWA local storage.
- `sw.js` : Service Worker pour la prise en charge hors-ligne et l'installation PWA.
- `manifest.json` : Configuration PWA pour installation mobile/desktop.
- `readme.html` & `readme.md` : Guide d'utilisation et principes nutritionnels.

---

🌱 **Prot-in-Watts** — *Cuisiner les protéines intelligemment en exploitant la chaleur résiduelle.*
