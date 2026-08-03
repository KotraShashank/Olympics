// Mirrors: data.sql
// MySQL needed a two-step INSERT then UPDATE score_type. Mongo doesn't need
// that trick - scoreType is just part of the same document from the start.
module.exports = [
  // Track & Field
  { name: 'Athletics - 100m Sprint', description: 'Sprint racing on a straight 100-meter track.', category: 'TRACK_AND_FIELD', olympicSport: true, iconUrl: '/icons/athletics.png', matchesPerLevel: 5, winsRequiredToAdvance: 3, scoreType: 'TIME_LOWER_WINS' },
  { name: 'Athletics - Long Jump', description: 'Jump as far as possible from a running start.', category: 'TRACK_AND_FIELD', olympicSport: true, iconUrl: '/icons/longjump.png', matchesPerLevel: 5, winsRequiredToAdvance: 3, scoreType: 'DISTANCE_HIGHER_WINS' },
  { name: 'Athletics - Javelin Throw', description: 'Throw a javelin spear for maximum distance.', category: 'TRACK_AND_FIELD', olympicSport: true, iconUrl: '/icons/javelin.png', matchesPerLevel: 5, winsRequiredToAdvance: 3, scoreType: 'DISTANCE_HIGHER_WINS' },
  { name: 'Marathon', description: 'Long-distance running race over 42.195 km.', category: 'TRACK_AND_FIELD', olympicSport: true, iconUrl: '/icons/marathon.png', matchesPerLevel: 5, winsRequiredToAdvance: 3, scoreType: 'TIME_LOWER_WINS' },

  // Aquatics
  { name: 'Swimming - Freestyle', description: '100m freestyle swimming in a pool.', category: 'AQUATICS', olympicSport: true, iconUrl: '/icons/swimming.png', matchesPerLevel: 5, winsRequiredToAdvance: 3, scoreType: 'TIME_LOWER_WINS' },
  { name: 'Swimming - Butterfly', description: '100m butterfly stroke swimming.', category: 'AQUATICS', olympicSport: true, iconUrl: '/icons/butterfly.png', matchesPerLevel: 5, winsRequiredToAdvance: 3, scoreType: 'TIME_LOWER_WINS' },
  { name: 'Diving', description: 'Perform acrobatic dives from platform or springboard.', category: 'AQUATICS', olympicSport: true, iconUrl: '/icons/diving.png', matchesPerLevel: 5, winsRequiredToAdvance: 3, scoreType: 'ARTISTIC_SCORE' },
  { name: 'Rowing', description: 'Row a boat across a course as fast as possible.', category: 'AQUATICS', olympicSport: true, iconUrl: '/icons/rowing.png', matchesPerLevel: 5, winsRequiredToAdvance: 3, scoreType: 'TIME_LOWER_WINS' },

  // Combat
  { name: 'Boxing', description: 'Compete in timed rounds of boxing against an opponent.', category: 'COMBAT', olympicSport: true, iconUrl: '/icons/boxing.png', matchesPerLevel: 5, winsRequiredToAdvance: 3, scoreType: 'COMBAT' },
  { name: 'Wrestling - Freestyle', description: 'Pin your opponent to the mat using wrestling techniques.', category: 'COMBAT', olympicSport: true, iconUrl: '/icons/wrestling.png', matchesPerLevel: 5, winsRequiredToAdvance: 3, scoreType: 'COMBAT' },
  { name: 'Judo', description: 'Throw or takedown your opponent using judo techniques.', category: 'COMBAT', olympicSport: true, iconUrl: '/icons/judo.png', matchesPerLevel: 5, winsRequiredToAdvance: 3, scoreType: 'COMBAT' },
  { name: 'Taekwondo', description: 'Score points by landing kicks and punches on the opponent.', category: 'COMBAT', olympicSport: true, iconUrl: '/icons/taekwondo.png', matchesPerLevel: 5, winsRequiredToAdvance: 3, scoreType: 'COMBAT' },
  { name: 'Fencing', description: 'Score points by landing touches with your weapon.', category: 'COMBAT', olympicSport: true, iconUrl: '/icons/fencing.png', matchesPerLevel: 5, winsRequiredToAdvance: 3, scoreType: 'POINTS' },
  { name: 'Weightlifting', description: 'Lift the maximum weight above your head in clean & jerk / snatch.', category: 'COMBAT', olympicSport: true, iconUrl: '/icons/weightlifting.png', matchesPerLevel: 5, winsRequiredToAdvance: 3, scoreType: 'WEIGHTLIFTING' },

  // Racket sports
  { name: 'Badminton', description: 'Rally a shuttlecock over a net using rackets.', category: 'RACKET', olympicSport: true, iconUrl: '/icons/badminton.png', matchesPerLevel: 5, winsRequiredToAdvance: 3, scoreType: 'SETS' },
  { name: 'Table Tennis', description: 'Fast-paced ping pong played on a table.', category: 'RACKET', olympicSport: true, iconUrl: '/icons/tabletennis.png', matchesPerLevel: 5, winsRequiredToAdvance: 3, scoreType: 'SETS' },
  { name: 'Tennis', description: 'Rally a tennis ball over a net on a full-sized court.', category: 'RACKET', olympicSport: true, iconUrl: '/icons/tennis.png', matchesPerLevel: 5, winsRequiredToAdvance: 3, scoreType: 'SETS' },

  // Team sports
  { name: 'Football (Soccer)', description: "Score goals by kicking the ball into the opponent's net.", category: 'TEAM', olympicSport: true, iconUrl: '/icons/football.png', matchesPerLevel: 5, winsRequiredToAdvance: 3, scoreType: 'GOALS' },
  { name: 'Basketball', description: "Score by shooting the ball through the opponent's hoop.", category: 'TEAM', olympicSport: true, iconUrl: '/icons/basketball.png', matchesPerLevel: 5, winsRequiredToAdvance: 3, scoreType: 'POINTS' },
  { name: 'Volleyball', description: "Score points by landing the ball in the opponent's court.", category: 'TEAM', olympicSport: true, iconUrl: '/icons/volleyball.png', matchesPerLevel: 5, winsRequiredToAdvance: 3, scoreType: 'SETS' },
  { name: 'Hockey (Field)', description: 'Score goals using a stick and ball on a field.', category: 'TEAM', olympicSport: true, iconUrl: '/icons/fieldhockey.png', matchesPerLevel: 5, winsRequiredToAdvance: 3, scoreType: 'GOALS' },
  { name: 'Rugby Sevens', description: "Score tries by carrying the ball across the opponent's line.", category: 'TEAM', olympicSport: true, iconUrl: '/icons/rugby.png', matchesPerLevel: 5, winsRequiredToAdvance: 3, scoreType: 'POINTS' },

  // Gymnastics
  { name: 'Artistic Gymnastics', description: 'Perform routines on apparatus like floor, beam, and bars.', category: 'GYMNASTICS', olympicSport: true, iconUrl: '/icons/gymnastics.png', matchesPerLevel: 5, winsRequiredToAdvance: 3, scoreType: 'ARTISTIC_SCORE' },
  { name: 'Rhythmic Gymnastics', description: 'Perform routines with apparatus like ribbon, hoop, and ball.', category: 'GYMNASTICS', olympicSport: true, iconUrl: '/icons/rhythmic.png', matchesPerLevel: 5, winsRequiredToAdvance: 3, scoreType: 'ARTISTIC_SCORE' },
  { name: 'Trampoline', description: 'Perform acrobatic tricks while bouncing on a trampoline.', category: 'GYMNASTICS', olympicSport: true, iconUrl: '/icons/trampoline.png', matchesPerLevel: 5, winsRequiredToAdvance: 3, scoreType: 'ARTISTIC_SCORE' },

  // Shooting
  { name: '10m Air Rifle', description: 'Shoot a target at 10 meters with an air rifle.', category: 'SHOOTING', olympicSport: true, iconUrl: '/icons/rifle.png', matchesPerLevel: 5, winsRequiredToAdvance: 3, scoreType: 'ACCURACY' },
  { name: '25m Pistol', description: 'Shoot a target at 25 meters with a pistol.', category: 'SHOOTING', olympicSport: true, iconUrl: '/icons/pistol.png', matchesPerLevel: 5, winsRequiredToAdvance: 3, scoreType: 'ACCURACY' },
  { name: 'Archery', description: 'Hit a target with arrows from a set distance.', category: 'SHOOTING', olympicSport: true, iconUrl: '/icons/archery.png', matchesPerLevel: 5, winsRequiredToAdvance: 3, scoreType: 'ACCURACY' },

  // Cycling
  { name: 'Cycling - Road Race', description: 'Cycle long distances on open roads for fastest time.', category: 'CYCLING', olympicSport: true, iconUrl: '/icons/cycling.png', matchesPerLevel: 5, winsRequiredToAdvance: 3, scoreType: 'TIME_LOWER_WINS' },
  { name: 'Cycling - Track Sprint', description: 'Short-distance sprint cycling on a velodrome track.', category: 'CYCLING', olympicSport: true, iconUrl: '/icons/cyclingtrack.png', matchesPerLevel: 5, winsRequiredToAdvance: 3, scoreType: 'TIME_LOWER_WINS' },

  // Traditional / popular Indian sports
  { name: 'Cricket', description: 'Score runs by hitting the ball and running between wickets.', category: 'TEAM', olympicSport: false, iconUrl: '/icons/cricket.png', matchesPerLevel: 5, winsRequiredToAdvance: 3, scoreType: 'CRICKET' },
  { name: 'Kabaddi', description: 'Tag opponents and return to your half without being tackled.', category: 'TEAM', olympicSport: false, iconUrl: '/icons/kabaddi.png', matchesPerLevel: 5, winsRequiredToAdvance: 3, scoreType: 'KABADDI' },
  { name: 'Kho-Kho', description: 'Chase and tag opponents in this traditional Indian sport.', category: 'TEAM', olympicSport: false, iconUrl: '/icons/khokho.png', matchesPerLevel: 5, winsRequiredToAdvance: 3, scoreType: 'POINTS' },
  { name: 'Carrom', description: 'Flick coins into pockets on a carrom board.', category: 'TRADITIONAL', olympicSport: false, iconUrl: '/icons/carrom.png', matchesPerLevel: 5, winsRequiredToAdvance: 3, scoreType: 'POINTS' },
  { name: 'Chess', description: "Outmaneuver your opponent and checkmate their king.", category: 'TRADITIONAL', olympicSport: false, iconUrl: '/icons/chess.png', matchesPerLevel: 5, winsRequiredToAdvance: 3, scoreType: 'POINTS' },
];
