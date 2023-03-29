using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    /// <summary>
    /// Configuration of challenge evaluation.
    /// </summary>
    public class ClearScriptChallengeEvaluationServiceOptions
    {
        /// <summary>
        /// JavaScript source code of Karel library.
        /// </summary>
        public required string KarelLibrarySource { get; set; }

        /// <summary>
        /// JavaScript source code of Karel evaluation library.
        /// </summary>
        public required string KarelEvaluationLibrarySource { get; set; }
    }
}
