Two-column cards:
```tsx
<div className="grid grid-cols-2 gap-6 mt-6">
  <div className="bg-white border-4 border-gray-200 p-5 rounded-2xl shadow-[0_8px_0_0_rgba(229,231,235,1)]">
    <h3 className="font-black text-xl mb-3">Goals</h3>
    <ul className="list-disc pl-5 space-y-2 text-gray-700 font-medium">
      <li>Shared tooling and standards</li>
      <li>Easy cross-team collaboration</li>
      <li>Simplified dependency management</li>
      <li>Clear ownership boundaries</li>
    </ul>
  </div>
  <div className="bg-white border-4 border-gray-200 p-5 rounded-2xl shadow-[0_8px_0_0_rgba(229,231,235,1)]">
    <h3 className="font-black text-xl mb-3">Monorepo Advantages</h3>
    <ul className="list-disc pl-5 space-y-2 text-gray-700 font-medium">
      <li>Easier sharing of UI components, utilities, design tokens</li>
      <li>Consistent CI/CD pipeline</li>
      <li>Simplified refactoring</li>
      <li>Unified dependency management</li>
    </ul>
  </div>
</div>
```