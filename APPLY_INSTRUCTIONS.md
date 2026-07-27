# কীভাবে এই ফাইলগুলো apply করবেন

## ১. এই ৩৪টা ফাইল আপনার repo-তে COPY করে existing ফাইল OVERWRITE করুন
(এই zip-এর ভেতরের ফোল্ডার স্ট্রাকচার আপনার প্রজেক্টের সাথে হুবহু মিলে যায় —
শুধু পুরো ফোল্ডার আপনার repo root-এ extract/paste করলেই যথেষ্ট)

নতুন ফাইল (আগে ছিল না):
- lib/content/course-data.ts
- lib/content/index.ts
- lib/content/quiz-data.ts
- lib/content/search.ts
- lib/progress/store.ts
- lib/progress/dashboard.ts

মডিফাইড ফাইল (আগেরটা replace হবে):
- .env.example
- README.md
- package.json
- lib/auth-context.tsx
- lib/i18n/localize-content.ts
- app/[locale]/dashboard/page.tsx
- app/[locale]/learning/page.tsx
- app/[locale]/learning/[slug]/page.tsx
- app/[locale]/learning/[slug]/[lessonId]/page.tsx
- app/[locale]/practice/page.tsx
- app/[locale]/practice/[quizId]/page.tsx
- app/[locale]/search/page.tsx
- app/[locale]/tools/[toolSlug]/page.tsx
- components/learning/mark-complete-button.tsx
- components/practice/quiz-taking.tsx
- components/tools/tool-frame.tsx
- components/labs/soil/sieve-analysis-lab.tsx
- components/labs/soil/direct-shear-lab.tsx
- components/labs/soil/compaction-test-lab.tsx
- components/labs/soil/atterberg-limits-lab.tsx
- components/labs/highway/aggregate-impact-lab.tsx
- components/labs/highway/bitumen-penetration-lab.tsx
- components/labs/concrete/compression-test-lab.tsx
- components/labs/concrete/flexural-test-lab.tsx
- components/labs/concrete/slump-test-lab.tsx
- components/labs/survey/levelling-lab.tsx
- components/labs/survey/total-station-lab.tsx
- components/labs/survey/traverse-lab.tsx

## ২. এই ফাইল/ফোল্ডারগুলো আপনার repo থেকে DELETE করুন
(আর দরকার নেই — Prisma/Postgres/Firestore পুরোপুরি বাদ)

- prisma/                          (পুরো ফোল্ডার)
- app/api/                         (পুরো ফোল্ডার)
- lib/prisma.ts
- lib/current-user.ts
- lib/verify-id-token.ts
- lib/queries/                     (পুরো ফোল্ডার)

## ৩. এরপর

```bash
npm install
```

`package.json`-এ `@prisma/client`, `prisma`, `firebase-admin`, `openai`, `tsx`
সরানো হয়েছে — তাই `npm install` পুরনো `node_modules`/`package-lock.json`
থাকলে আগে সেগুলো মুছে fresh install করাই নিরাপদ:

```bash
rm -rf node_modules package-lock.json
npm install
```

তারপর `.env.example` → `.env.local` কপি করে শুধু ৬টা `NEXT_PUBLIC_FIREBASE_*`
ভ্যারিয়েবল পূরণ করুন (আর কিছু লাগবে না — DATABASE_URL বা Firebase Admin key
আর দরকার নেই)।

```bash
npm run dev
```
