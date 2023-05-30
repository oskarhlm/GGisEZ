function findMovedElement<T>(
	oldList: T[],
	newList: T[]
): { movedElement: T; notInFrontElement: T | null } | null {
	if (oldList.length !== newList.length) throw new Error('Lists should include the same elements');

	let movedElement: T | null = null;
	let notInFrontElement: T | null = null;

	for (let i = 0; i < oldList.length; i++) {
		if (oldList[i] !== newList[i]) {
			// Element has moved
			movedElement = oldList[i];

			if (i > 0 && oldList[i - 1] !== newList[i - 1]) {
				// Element is not in front anymore
				notInFrontElement = oldList[i - 1];
			}

			break;
		}
	}

	return movedElement !== null ? { movedElement, notInFrontElement } : null;
}

function compareLists(
	originalList: any[],
	updatedList: any[]
): { movedElement: any; notInFrontElement: any } | null {
	if (originalList.length !== updatedList.length) {
		// Lists are not of the same length, cannot compare
		return null;
	}

	let movedElement: any = null;
	let notInFrontElement: any = null;

	for (let i = 0; i < originalList.length; i++) {
		if (originalList[i] !== updatedList[i]) {
			// Element has moved
			movedElement = originalList[i];

			if (i > 0 && originalList[i - 1] !== updatedList[i - 1]) {
				// Element is not in front anymore
				notInFrontElement = originalList[i - 1];
			}

			break;
		}
	}

	return movedElement !== null ? { movedElement, notInFrontElement } : null;
}
