# AI CMS Demo Útmutató - Magyar

## Demo Beállítása

1. **Indítsa el a fejlesztői szervert:**
   ```bash
   npm run dev
   ```

2. **Nyissa meg a böngészőben:**
   ```
   http://localhost:3000
   ```

3. **Jelentkezzen be a demo felhasználóval:**
   - Email: demo@brease.com
   - Jelszó: password123

4. **Navigáljon a Teams oldalra:**
   - Kattintson a "Teams" menüpontra a bal oldali navigációs sávon
   - Itt láthatja a csapattagokat és a site-okat

## Demo Forgatókönyvek

### 1. Forgatókönyv: Csapattag Bio Frissítése

**Lépések:**
1. A Teams oldalon kattintson az AI asszisztens ikonra (jobb alsó sarok)
2. Írja be: "Update Sarah's bio to mention her expertise in machine learning"
3. Tekintse meg az előnézetet
4. Kattintson az "Approve & Apply" gombra
5. Sarah bio-ja azonnal frissül a Teams oldalon

**Eredmény:** Sarah Johnson profilja mostantól kiemeli a gépi tanulásban szerzett szakértelmét.

### 2. Forgatókönyv: Dokumentum Feltöltése Oldalként

**Lépések:**
1. Maradjon a Teams oldalon
2. Az AI chatben írja be: "Upload document" vagy "Create page from document"
3. Töltse fel a company-profile.pdf fájlt
4. Tekintse meg az előnézetet az 5 létrehozott szekcióval
5. Kattintson az "Approve & Apply" gombra
6. Navigáljon: Sites → Demo Site → Pages
7. Lássa az új "Company Profile" oldalt

**Eredmény:** Új oldal jött létre 5 szekcióval a feltöltött dokumentum alapján.

### 3. Forgatókönyv: Oldal Átnevezése

**Lépések:**
1. Navigáljon: Sites → Demo Site → Pages
2. Nyissa meg az AI asszisztenst
3. Írja be: "Rename Contact page to Get in Touch"
4. Tekintse meg az előnézetet (oldal név és slug változás)
5. Kattintson az "Approve & Apply" gombra
6. Az oldal azonnal átneveződik a listában

**Eredmény:** A "Contact" oldal mostantól "Get in Touch" néven jelenik meg új URL-lel.

### 4. Forgatókönyv: Google Analytics Integráció

**Lépések:**
1. Maradjon a Pages oldalon
2. Az AI chatben írja be: "Add Google Analytics tracking code GA-12345"
3. Tekintse meg az előnézetet a követőkóddal
4. Kattintson az "Approve & Apply" gombra
5. A kód mostantól aktív minden oldalon

**Eredmény:** Google Analytics követés hozzáadva a Demo Site-hoz.

### 5. Forgatókönyv: Csapattag Eltávolítása

**Lépések:**
1. Navigáljon vissza a Teams oldalra
2. Az AI chatben írja be: "Remove Alex Chen from team"
3. Tekintse meg a megerősítő üzenetet
4. Kattintson az "Approve & Apply" gombra a megerősítéshez
5. Alex Chen eltűnik a csapattagok listájából

**Eredmény:** Alex Chen sikeresen eltávolítva a csapatból.

## Megjegyzések

- **Előnézet-első megközelítés:** Minden változtatás előnézettel kezdődik
- **Biztonságos visszavonás:** Használja a "Cancel" gombot a változtatások elvetéséhez
- **Azonnali frissítések:** A változások azonnal életbe lépnek jóváhagyás után
- **Természetes nyelv:** Az AI megérti a természetes nyelven megfogalmazott parancsokat