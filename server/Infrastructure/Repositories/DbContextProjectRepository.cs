using ApplicationCore.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    internal class DbContextProjectRepository : DbContextRepository<Project, int>, IProjectRepository
    {
    }
}
