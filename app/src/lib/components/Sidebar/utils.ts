export function findMovedElement<T>(
	oldList: T[],
	newList: T[]
): { movedElement: T; elementInFront: T | null } | null {
	if (oldList.length !== newList.length) throw new Error('Lists should include the same elements');

	let movedElement: T | null = null;
	let elementInFront: T | null = null;

	for (let i = 0; i < oldList.length; i++) {
		if (oldList[i] !== newList[i]) {
			// Element has moved
			movedElement = oldList[i];
			break;
		}
	}

	if (!movedElement) return null;
	const newListPosition = newList.indexOf(movedElement);

	if (newListPosition === newList.length) return { movedElement, elementInFront: null };

	elementInFront = newList[newListPosition + 1];

	return movedElement !== null ? { movedElement, elementInFront } : null;
}
