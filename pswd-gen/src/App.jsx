import { useState, useEffect, useCallback, useRef } from "react";

const App = () => {
  const [length, setLength] = useState(8);
  const [numAllowed, setNumAllowed] = useState(false);
  const [charAllowed, setCharAllowed] = useState(false);
  const [pswd, setPswd] = useState("");

  // We use useRef to store things in background, use in logic, without showing or refreshing the screen.
  const pwsdRef = useRef(null);

  //   React will only re-create this pswdGenerator() function if length, numAllowed, or charAllowed change.
  // Otherwise, React uses old saved function — this makes React faster.
  const pswdGenerator = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    if (numAllowed) str += "0123456789";
    if (charAllowed) str += "!@#$%^&*()+_-=?/~`";

    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length + 1);

      pass += str.charAt(char);
    }
    setPswd(pass);
  }, [length, numAllowed, charAllowed, setPswd]);

  const copyPswdToClipBoard = useCallback(() => {
    pwsdRef.current?.select();

    window.navigator.clipboard.writeText(pswd);
  }, [pswd]);

  // useEffect — Run Code When Something Changes
  // You want to automatically generate a password when length, number, or character checkbox changes.
  useEffect(() => {
    pswdGenerator();
  }, [length, numAllowed, charAllowed, pswdGenerator]);
  return (
    <div className="w-full max-w-md mx-auto shadow-ms rounded-ls px-4 my-8 text-orange-500">
      <div className="flex shadow rounded-lg , overflow-hidden mb-4">
        <input
          type="text"
          value={pswd}
          className="outline-none w-full py-1 px-3"
          placeholder="Password"
          readOnly
          ref={pwsdRef}
        />
        <button onClick={copyPswdToClipBoard} className="px-4 py2 bg-amber-950">
          Copy
        </button>
      </div>
      <div className="flex text-sm gap-x-2">
        <div className="flex items-center gap-x-1">
          <input
            type="range"
            min={6}
            max={100}
            value={length}
            className="cursor-pointer"
            onChange={(e) => setLength(e.target.value)}
          />
          <label>Length : {length}</label>
        </div>
        <div className="flex items-center gap-x-1">
          <input
            type="checkbox"
            defaultChecked={charAllowed}
            id="charInput"
            onChange={() => {
              setCharAllowed((prev) => !prev);
            }}
          />
          <label htmlFor="charInpput">Characters</label>
        </div>
        <div className="flex items-center gap-x-1">
          <input
            type="checkbox"
            defaultChecked={numAllowed}
            id="numberInput"
            onChange={() => {
              setNumAllowed((prev) => !prev);
            }}
          />
          <label htmlFor="numberInpput">Numbers</label>
        </div>
      </div>
    </div>
  );
};

export default App;

// | Tool          | What it memoizes                |
// | ------------- | ------------------------------- |
// | `useCallback` | Memoizes a **function**         |
// | `useMemo`     | Memoizes a **value/result**     |
// | `React.memo`  | Memoizes a **component render** |

// You wrote a function called "make password".
// Every time React re-renders your component, it will normally create that function again.
// But using useCallback, we save that function, and React reuses the old one (if inputs didn’t change).

// useRef — Direct Access to HTML Element
// Imagine:
// You want to click a button, and React should copy the password from the input box.
// But how to access that <input> directly?
// That’s why you used:

// const pwsdRef = useRef(null);
// Then you used:

// pwsdRef.current.select();
// Which means:

// “Find this input box, and select its text.”

// DOM = Bridge between brain (JS) and body (HTML)

// ✅ Real Problem (Before React)
// 🔴 1. DOM is slow
// Browser ka real DOM bahut heavy & slow hota hai.

// Agar tum page ke 100 elements me se sirf 1 change karte ho, tab bhi browser poore DOM ko check karta hai.

// 🔴 2. Re-rendering pura DOM mehnga hota hai
// Socho tumhara ek button click hota hai...

// Page ka sirf ek text change hota hai…

// Lekin browser poora DOM traverse karta hai — performance slow ho jaata hai.

// 💡 React Team Thought:
// "Kyu na hum ek lightweight, fast copy of DOM banayein...
// usme changes calculate karein...
// aur finally sirf wahi real DOM me update karein jo zaroori hai."

// 👉 Is idea ka naam tha: Virtual DOM

// ✅ So Virtual DOM kya karta hai?
// React ek virtual copy of real DOM banata hai (JavaScript object me)

// Jab state change hoti hai:

// React new Virtual DOM banata hai

// Purani aur nayi virtual DOM ko compare (diff) karta hai

// Sirf changed elements ko real DOM me update karta hai

// Batching	Multiple updates ek saath
// Tum setState() likhte ho

// React internally queue me daal deta hai

// React sochta hai:
// “Kya aur koi state bhi change ho rahi hai?”

// Agar haan, to sab ko ek saath re-render karega
// (performance fast rehti hai)

// 🧠 React Fiber Kya Hota Hai?
// React Fiber ek nayi system (engine) hai React ke andar jo kaam ko tod-tod ke karta hai, taki:

// App hang na ho

// Screen smooth lage

// Important kaam pehle ho

// 🔥 Real Life Example (Jaldi Samajhne ke Liye):
// Socho tumhare paas ek 100 page ki copy check karni hai.

// Old React:
// Pehle saare 100 pages check karta, fir result deta. Beech me koi bole bhi to ignore.

// Fiber React:
// 1 page check karo →
// agar beech me teacher bula le → ruk jao
// phir wapas wahi se start → last tak pahucho.

// React Fiber = kaam thoda thoda karke, priority se, ruk ke karne wali system

// ⚙️ Fiber Kis Tareeke Se Kaam Karta Hai?
// 1. Fiber ek Tree (pehd jaisa) banata hai
// Har component ek Fiber node hota hai.

// Jaise:
// <App>
//   <Header />
//   <Body />
// </App>
// Ye banega Fiber Tree:

// App
// ├── Header
// └── Body
// 2. Fiber ke 2 Steps Hote Hain
// 🧱 Render Phase
// React check karta hai kya badla hai

// DOM ko abhi touch nahi karta

// Ye phase pause ho sakta hai

// 🚀 Commit Phase
// Ab jo bhi badla tha wo actual screen me update hota hai

// Ye phase pause nahi hota

// 3. Fiber Ka Magic: Pause & Resume
// React Fiber ka kaam:

// "Important kaam pehle"

// "Lambi process ko tod do"

// "Screen ko kabhi block mat karo"

// 🎯 Fiber Internally Kya Rakhta Hai?
// Har Fiber node ke paas hota hai:

// type: kaun sa element/component hai

// child, sibling, parent: structure banane ke liye

// state, props, DOM reference

// alternate: purani wali copy (compare karne ke liye)

// 🌀 Time-Slicing Kya Hai?
// React har ek step me check karta hai:

// “Kya mujhe ruk jana chahiye?” (shouldYield())

// Agar haan, to React pause karta hai,
// baad me wahi se continue karta hai.

// 📊 Priority Kaise Decide Hota Hai?
// React batata hai kis kaam ki priority high hai:

// Priority	Example
// 🔴 High	Button click, typing
// 🟡 Medium	Animation, scroll
// ⚪ Low	Background logging

// Jo kaam important hota hai, wo pehle karta hai.

// 🔄 Double Buffering
// React ke paas ek new version aur ek old version hota hai.

// Naya tree banta hai → purane se compare hota hai

// Fir swap ho jaata hai → update screen

// Isse speed fast ho jaati hai.

// 🧠 React Fiber Ka Fayda:
// App hang nahi hoti

// Screen fast react karti hai

// Important kaam pehle hota hai

// Background me updates bhi chalte rehte hai

// React ka future features (like Suspense, Concurrent Mode) possible hote hai

// 📌 Ek Line Me:
// React Fiber React ka naya engine hai jo screen ko fast, smooth aur smart banata hai by breaking work into pieces and running important updates first.

// 🧠 Reconciliation:
// React kehta hai:

// “Mujhe purana aur naya DOM mila. Main bas check karunga kya badla hai, fir sirf wohi update karunga.”

// 🧪 Ye kaam karta hai virtual DOM ke sath.

// ⚙️ Fiber:
// React kehta hai:

// “Yeh kaam bahut lamba hai, main isse tod kar thoda thoda karunga, important cheez pehle, baaki baad me.”

// 🧪 Ye kaam karta hai Fiber Nodes ke sath — ek puri system banata hai render ko efficiently handle karne ke liye.

// 🏰 Welcome to the React Kingdom 👑
// Once upon a time, in the React Kingdom, every website was like a Magic Screen ✨ called the DOM (Document Object Model). But updating this screen was slow and costly, so the React team invented a smarter system with special workers and tools.

// Let’s meet the main characters in this story 👇

// 🧙‍♂️ Virtual DOM — The Copycat Artist
// Imagine the real DOM is a big, heavy painting.

// React doesn’t paint on it directly.

// So it creates a Virtual DOM — like a lightweight sketchbook 📝 to try ideas first.

// 🗣 React says:

// "Let’s make changes here first and only update the real canvas when absolutely needed!"

// 🧠 Reconciliation — The Difference Checker
// Whenever your app updates (state, props change), the Reconciler wakes up.

// 🔍 Reconciliation = “Spot the difference” game between:

// Old Virtual DOM

// New Virtual DOM

// 🧠 It compares both trees and figures out:

// "Which part of the real DOM actually needs to change?"

// ⚙️ Fiber — The Smart Worker System
// Now enters the hero: Fiber 🧑‍🔧

// Before Fiber:

// React did everything at once (like painting the whole room without breaks 😰).

// After Fiber:

// React now breaks the work into small parts called units of work.

// It can pause, continue, or cancel these tasks based on priority (like emergency buttons).

// 🗣 Fiber says:

// “I’ll do big work in small steps. If something urgent comes up (like user input), I’ll pause and handle it first.”

// ✅ Benefits:

// Smooth scrolling

// Fast user response

// Time slicing (breaking work into timed chunks)

// 🗃 Batching — The Package Master
// Now comes Batching, the messenger 📦.

// React doesn’t send one message per change. Instead:

// It collects multiple updates (like setState calls)

// Puts them in one batch

// Sends them together to the Fiber system

// 🗣 Batching says:

// “Why go 10 times to market? I’ll pack everything together and deliver once!”

// That’s why:

// js
// Copy code
// setCount(count + 1);
// setCount(count + 1);
// == only one update, unless you use functional updates.

// 🔁 Render Cycle — The Flow of Work
// Here’s the overall cycle:

// Event triggers state change (setState)

// Batching collects all changes

// Fiber creates a tree of units of work

// Reconciliation finds the differences

// Fiber schedules tasks by priority

// Final changes are applied to real DOM

// 🔄 Time Slicing & Priority (Advanced Fiber Feature)
// Fiber is smart. It asks:

// “Do I have enough time to continue, or should I let more important tasks (like click events) run first?”

// This makes your app feel buttery smooth 🧈 even under load.

// 🧵 Putting it All Together — The Story
// A button is clicked:
// setCount(1) is called

// 🗃 Batching says: “Let me collect updates.”

// 🧠 Reconciliation says: “What changed?”

// 🧑‍🔧 Fiber says: “Let’s break this into pieces and work smartly.”

// 🎨 DOM is finally updated

// 🧠 Bonus: Other Helpers
// Concept	Role in Story
// ReactDOM.render	Starts the whole app
// useState	Local state holder
// useEffect	Runs after paint (side jobs)
// React.memo	Skips render if props same
// useCallback	Memoizes function references
// useMemo	Memoizes computed values

// 🧑‍🏫 Summary in One Line Each:
// Virtual DOM: A sketch before touching the real DOM.

// Reconciliation: Finds what changed.

// Fiber: Does work in small, smart steps.

// Batching: Combines updates to run together.

// Time Slicing: Helps prioritize urgent tasks.

// Render Cycle: Full flow from event to UI update.

// 📦 Cache is tied to the component
// Each React component (under the hood, each Fiber node) holds:

// A list of hooks used

// Their stored values/functions

// And their dependency arrays

// You can imagine it like:

// fiberNode = {
//   hookState: [
//     /* useState state */,
//     /* useEffect cleanup */,
//     /* useCallback cached function */,
//     ...
//   ]
// }

// 🔄 What happens when deps change?
// Let’s say:

// js
// Copy code
// const fn = useCallback(() => console.log(x), [x]);
// If x changes:

// React sees that dependency changed

// React throws away the old function

// And stores the new one in its place

// ➡️ So the cache is refreshed with the new function.




// | Situation                                   | Use This Hook |
// | ------------------------------------------- | ------------- |
// | You want to access DOM                      | `useRef`      |
// | You want to avoid recalculating a value     | `useMemo`     |
// | You want to avoid remaking a function       | `useCallback` |
// | You want to manage complex state logic      | `useReducer`  |
// | You want to store a value but not re-render | `useRef`      |


// | Hook          | What it does               | Triggers Re-render? | Easy Words                   |
// | ------------- | -------------------------- | ------------------- | ---------------------------- |
// | `useRef`      | Stores a value or DOM      | ❌ No                | Like a hidden box            |
// | `useCallback` | Saves a function           | ❌ No                | Like saving a recipe         |
// | `useMemo`     | Saves a calculation result | ❌ No                | Like saving an answer        |
// | `useReducer`  | Manages state              | ✅ Yes               | Like a brain for state logic |




// ✅ 1. React Basics (Already Covered by You)
// JSX, Components

// useState, useEffect

// Context API

// Custom Hooks

// useRef, useCallback, useMemo

// 🟡 2. Intermediate Level (You should learn next)
// React Router DOM

// Navigating pages without reload

// useNavigate, useParams, useLocation

// Conditional Rendering

// Showing/hiding components based on state

// Forms in React

// Controlled vs Uncontrolled

// Form validation

// Error Boundaries

// How to catch UI errors without crashing the app

// PropTypes / Type Checking

// Validating props passed to components

// Higher-Order Components (HOC)

// Function that returns a component

// React Portals

// Render modal/popups outside the main DOM tree

// Fragments and Keys

// Why keys matter in loops

// useLayoutEffect vs useEffect

// Layout effect runs before paint

// Suspense & Lazy Loading

// Load components only when needed (code-splitting)

// 🔴 3. Advanced Level / Interview / Production
// React Query / TanStack Query

// Data fetching + caching + mutation

// Server-Side Rendering (SSR)

// Learn this in Next.js

// Hydration and Pre-rendering

// How HTML becomes dynamic

// State Management Libraries

// Redux Toolkit, Zustand, Jotai, Recoil

// Performance Optimization

// React.memo, useMemo, useCallback use properly

// Avoid unnecessary re-renders

// Testing in React

// Unit testing with Jest & React Testing Library

// Custom Render Props

// Another pattern for component reuse

// React DevTools

// Profiling and debugging components

// 🌐 4. Ecosystem You Must Know
// (These help build real projects)

// Next.js (Full-stack React framework)

// Tailwind CSS / Styled Components

// Form Libraries: React Hook Form, Formik

// Authentication: Firebase / JWT / OAuth

// Deployment: Vercel / Netlify / Surge

// API Handling: Axios, Fetch, REST, GraphQL

// Websockets: Real-time features

// ⚒️ 5. Projects You Can Build
// Todo App with Context + useReducer

// Password Generator (already done)

// Blog with Router + Auth

// Weather App using API + useEffect

// Chat App with Socket.io

// Dashboard with filtering/search (with useMemo)

// Notes App with localStorage
