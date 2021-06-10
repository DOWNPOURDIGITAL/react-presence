# @downpourdigital/react-presence

A callback based presence wrapper for (un)mount animations.

## Installation

```
yarn add @downpourdigital/react-presence
```

```
npm i @downpourdigital/react-presence
```

## Usage

A `PresenceWrapper` represents the "top level" mounting point. It receives a `visible` prop, which determines whether the children should be visible or not. If this prop changes, the children's in/out hooks are called and they remain mounted in the tree until all callbacks have completed.

```tsx
import React from "react";
import { PresenceWrapper } from "@downpourdigital/react-presence";

const MyApp = ({ shouldShow }) => (
	<PresenceWrapper visible={shouldShow}>
		<ChildWithAnimation />
	</PresenceWrapper>
);
```

```tsx
// ChildWithAnimation.tsx

import React from "react";
import { usePresenceDelay } from "@downpourdigital/react-presence";

const ChildWithAnimation = () => {
	usePresenceDelay(() => ({
		in: (cb) => {
			// some in animation here
			const timeout = setTimeout(() => {
				// run callback once animation is completed
				cb();
			}, 1000);

			// return cleanup function, which runs if
			// animation is cancelled
			return () => {
				clearTimeout(timeout);
			};
		},
		out: (cb) => {
			// some out animation here
			const timeout = setTimeout(() => {
				// run callback once animation is completed
				cb();
			}, 1000);

			// return cleanup function, which runs if
			// animation is cancelled
			return () => {
				clearTimeout(timeout);
			};
		},
	}));

	return <h1>Hello world</h1>;
};
```

```tsx
// ChildWithEffect.tsx

import React from "react";
import { usePresenceEffect } from "@downpourdigital/react-presence";

const ChildWithEffect = () => {
	usePresenceEffect(() => {
		console.log("runs when IN anims start");
		return () => {
			console.log("runs when OUT anims start");
		};
	}, []);

	return <h1>Hello world</h1>;
};
```

```tsx
// ChildWithState.tsx

import React from "react";
import { usePresence } from "@downpourdigital/react-presence";

const ChildWithState = () => {
	const visible = usePresence();

	return <h1>I am {visible ? "visible" : "hidden"}!</h1>;
};
```

```tsx
// ChildWithTransition.tsx

import React from "react";
import { usePresenceLate } from "@downpourdigital/react-presence";

const ChildWithTransition = () => {
	// this will initally be false and only update
	// after all styles have propagated,
	// allowing for in/out animations with CSS transitions
	const visible = usePresenceLate();

	return (
		<h1
			style={{
				transition: "opacity .25s",
				opacity: visible ? 1 : 0,
			}}
		>
			Hello there!
		</h1>
	);
};
```
