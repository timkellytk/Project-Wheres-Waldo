import React from 'react';
import Card from '../components/Card/Card';
import level1 from '../img/levels/level-1.jpg';
import level2 from '../img/levels/level-2.jpg';
import level3 from '../img/levels/level-3.jpg';
import level4 from '../img/levels/level-4.jpg';
import level5 from '../img/levels/level-5.jpg';
import level6 from '../img/levels/level-6.jpg';

const Home = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card img={level1} alt="Level 1 Where's Waldo" waldo odlaw wizard>
        Level 1
      </Card>
      <Card img={level2} alt="Level 2 Where's Waldo" waldo>
        Level 2
      </Card>
      <Card img={level3} alt="Level 3 Where's Waldo" waldo odlaw wizard wenda>
        Level 3
      </Card>
      <Card img={level4} alt="Level 4 Where's Waldo" waldo odlaw wenda>
        Level 4
      </Card>
      <Card img={level5} alt="Level 5 Where's Waldo" waldo odlaw wizard wenda>
        Level 5
      </Card>
      <Card img={level6} alt="Level 6 Where's Waldo" waldo>
        Level 6
      </Card>
    </div>
  );
};

export default Home;
