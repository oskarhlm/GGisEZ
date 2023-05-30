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
