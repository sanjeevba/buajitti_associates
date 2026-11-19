import * as migration_20261027_154718_initial from './20261027_154718_initial'
import * as migration_20261119_020049_buajitti_content from './20261119_020049_buajitti_content'

export const migrations = [
  {
    up: migration_20261027_154718_initial.up,
    down: migration_20261027_154718_initial.down,
    name: '20261027_154718_initial',
  },
  {
    up: migration_20261119_020049_buajitti_content.up,
    down: migration_20261119_020049_buajitti_content.down,
    name: '20261119_020049_buajitti_content',
  },
]
