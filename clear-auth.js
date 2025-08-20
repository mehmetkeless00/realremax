console.log('Clearing auth state...');
localStorage.removeItem('user-storage');
sessionStorage.clear();
console.log('Auth state cleared!');
