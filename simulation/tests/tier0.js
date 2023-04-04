const world = new World();

// Set some characters in the world
world.set(0, 0, '山');
world.set(1, 0, '水');
world.set(0, 1, '木');
world.set(1, 1, '田');

// Get a character at a specific coordinate
console.log(world.get(0, 0)); // Output: 山

// Check if a character exists at a specific coordinate
console.log(world.has(0, 0)); // Output: true
console.log(world.has(2, 2)); // Output: false

// Delete a character at a specific coordinate
world.delete(0, 0);

// Check if the character was deleted
console.log(world.has(0, 0)); // Output: false