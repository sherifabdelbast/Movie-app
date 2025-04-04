import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TeamMember {
  name: string;
  position: string;
  image: string;
  social: {
    github: string; // Changed from twitter to github
    linkedin: string;
  }
}

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent {
  teamMembers: TeamMember[] = [
    {
      name: 'Sara Emad',
      position: 'Software Engineer',
      image: '/sara.jpg',
      social: {
        github: 'https://github.com/Sara-Emad', 
        linkedin: 'https://www.linkedin.com/in/sara-3433a9287/'
      }
    },
    {
      name: 'Sherif Abdelbaset',
      position: 'Software Engineer',
      image: '/sherif.jpg',
      social: {
        github: 'https://github.com/sherifabdelbast', 
        linkedin: 'https://www.linkedin.com/in/sherifabdelbast/'
      }
    },
    {
      name: 'Peter Mahfouz',
      position: 'Full Stack PHP',
      image: '/peter.jpg',
      social: {
        github: 'https://github.com/petermahfouz22', 
        linkedin: 'https://www.linkedin.com/in/peter-mahfouz-8342bb166/'
      }
    },
    {
      name: 'Mohamed Elshemy',
      position: 'Full Stack PHP',
      image: '/mohamed.jpg',
      social: {
        github: 'https://github.com/mhamedelshemy', 
        linkedin: 'https://www.linkedin.com/in/mohamed-elshemy-aaa804184/'
      }
    },
    {
      name: 'Amr Farouk',
      position: 'Full Stack PHP',
      image: '/amr.jpg',
      social: {
        github: 'https://github.com/Amro6779', 
        linkedin: 'https://www.linkedin.com/in/amro-h-farouq-44b8652a9/'
      }
    }
  ];
}