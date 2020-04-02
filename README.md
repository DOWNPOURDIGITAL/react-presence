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

A `PresenceWrapper` represents the "top level" mounting point. It receives a `visible` prop, which determines whether the children should be visible or not. If this prop  changes, the children's in/out hooks are called and the remain mounted in the tree until all callbacks have completed.

```typescript
import React from 'react';
import { PresenceWrapper } from '@downpourdigital/react-presence';


const MyApp = ({ shouldShow }) => (
	<PresenceWrapper visible={shouldShow}>
		<ChildWithAnimation />
	</PresenceWrapper>
);

```

```typescript
// ChildWithAnimation.tsx

import React from 'react';
import { usePresenceDelay } from '@downpourdigital/react-presence';


const ChildWithAnimation = () => {
	usePresenceDelay( () => ({
		in: cb => {
			// some in animation here
			const timeout = setTimeout( () => {
				// run callback once animation is completed
				cb();
			}, 1000 );

			// return cleanup function, which runs if
			// animation is cancelled
			return () => {
				clearTimeout( timeout );
			};
		},
		out: cb => {
			// some out animation here
			const timeout = setTimeout( () => {
				// run callback once animation is completed
				cb();
			}, 1000 );

			// return cleanup function, which runs if
			// animation is cancelled
			return () => {
				clearTimeout( timeout );
			};
		},
	}) );

	return (
		<h1>Hello world</h1>
	);
};

```
