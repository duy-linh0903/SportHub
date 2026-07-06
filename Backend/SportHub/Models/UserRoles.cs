using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportHub.Models
{
    public class UserRoles
    {
        public Guid UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public virtual Users User { get; set; }
        public Guid RoleId {  get; set; }
        [ForeignKey(nameof(RoleId))]
        public virtual Roles Roles { get; set; }
    }
}
